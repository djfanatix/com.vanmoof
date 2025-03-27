"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const homey_1 = require("homey");
const vanmoofcrypto_1 = __importDefault(require("./vanmoofcrypto"));
class vanmoofbike {
    constructor(bikeProfile, encryptionKey) {
        this.bikeProfile = bikeProfile;
        this.cryptService = new vanmoofcrypto_1.default(encryptionKey);
        //this.userKeyId = userKeyId not for S1
        //console.log('userKeyId', userKeyId)
        this.encryptionKey = encryptionKey;
        //const passcode = this.cryptService.getPasscode()
        //console.log('Passcode', passcode)
        // console.log('encryptionKey', encryptionKey)
        this.logger = new homey_1.SimpleClass();
    }
    async authenticate(bluetoothConnection) {
        const nonce = await this.getSecurityChallenge(bluetoothConnection);
        console.log('Start authenticate');
        const passcode = this.cryptService.getPasscode();
        const command = new Uint8Array([1]);
        const paddLength = 16 - ((nonce.length + command.length + passcode.length) % 16);
        const data = new Uint8Array([
            ...nonce,
            ...command,
            ...passcode,
            ...new Uint8Array(paddLength),
        ]);
        console.log('data non encrypted', data);
        const dataencrypt = this.cryptService.encrypt(data);
        console.log('data encrypted', dataencrypt);
        const genericAccessService = await bluetoothConnection.getService('8e7f1a50087a44c9b292a2c628fdd9aa');
        await genericAccessService.write('8e7f1a53087a44c9b292a2c628fdd9aa', dataencrypt);
    }
    async makeEncryptedPayload(bluetoothConnection, data) {
        console.log('make encrypted payload');
        const nonce = await this.getSecurityChallenge(bluetoothConnection);
        const command = new Uint8Array([1]);
        const paddLength = 16 - ((nonce.length + command.length + data.length) % 16);
        const dataToEncrypt = new Uint8Array([
            ...nonce,
            ...command,
            ...data,
            ...new Uint8Array(paddLength),
        ]);
        console.log('to be encrypted payload', dataToEncrypt);
        return this.cryptService.encrypt(dataToEncrypt);
    }
    async readFromBike(bluetoothConnection, service, characteristic) {
        console.log('read from bike');
        const genericAccessService = await bluetoothConnection.getService(service);
        const data = await genericAccessService.read(characteristic);
        const uint8Array = new Uint8Array(data);
        //console.log(`Read ${uint8Array} from ${service} - ${characteristic}`)
        return uint8Array;
    }
    async writeToBike(bluetoothConnection, payload, service, characteristic, writeWithoutEncryption = false) {
        const genericAccessService = await bluetoothConnection.getService(service);
        if (!writeWithoutEncryption) {
            const data = await this.makeEncryptedPayload(bluetoothConnection, payload);
            await genericAccessService.write(characteristic, data);
            console.log(`Wrote with encryption ${data} to ${service} - ${characteristic}`);
        }
        else {
            await genericAccessService.write(characteristic, payload);
            console.log(`Wrote without encryption ${payload} to ${service} - ${characteristic}`);
        }
    }
    async getSecurityChallenge(bluetoothConnection) {
        console.log('Get Security challenge');
        const nonce = await this.readFromBike(bluetoothConnection, '8e7f1a50087a44c9b292a2c628fdd9aa', '8e7f1a51087a44c9b292a2c628fdd9aa');
        console.log('Nonce Security challenge', nonce);
        return nonce;
    }
    async getParameters(bluetoothConnection) {
        const parameters = await this.readFromBike(bluetoothConnection, '8e7f1a50087a44c9b292a2c628fdd9aa', '8e7f1a54087a44c9b292a2c628fdd9aa');
        const parametersDecrypt = this.cryptService.decrypt(parameters);
        // console.log('Parameters', parametersDecrypt)
        return parametersDecrypt;
    }
}
exports.default = vanmoofbike;
//# sourceMappingURL=vanmoofbike.js.map