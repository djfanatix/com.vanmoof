import { SimpleClass } from 'homey';
import vanmoofcrypto from './vanmoofcrypto';
import { log } from 'console';

export default class vanmoofbike {
    bikeProfile
    cryptService
    userKeyId
    encryptionKey
    logger


    constructor(bikeProfile: string, encryptionKey: string, userKeyId: number) {
        this.bikeProfile = bikeProfile
        this.cryptService = new vanmoofcrypto(
            encryptionKey
        )
        //this.userKeyId = userKeyId
        //NOT NEEDED FOR S1    
        this.userKeyId = 'xxxx'
        //console.log('userKeyId', userKeyId)
        this.encryptionKey = encryptionKey
        //const passcode = this.cryptService.getPasscode()

        //console.log('Passcode', passcode)
       // console.log('encryptionKey', encryptionKey)
        this.logger = new SimpleClass()
    }

    async authenticate (bluetoothConnection: any) {
        //const nonce = await this.getSecurityChallenge(bluetoothConnection)     
        const passcode = this.cryptService.getPasscode()  
        const data = new Uint8Array([...passcode ])
        console.log('data', data)
        await this.writeToBike(bluetoothConnection, data, '8e7f1a50087a44c9b292a2c628fdd9aa', '8e7f1a53087a44c9b292a2c628fdd9aa', false)
    }

    async makeEncryptedPayload(bluetoothConnection: any, data: Uint8Array): Promise<Uint8Array> {
        console.log('make encrypted payload')
        const nonce = await this.getSecurityChallenge(bluetoothConnection)
        const paddLength = 16 - ((nonce.length + data.length) % 16)
        const dataToEncrypt = new Uint8Array([
            ...nonce,
            ...data,
            ...new Uint8Array(paddLength),
        ])
        return this.cryptService.encrypt(dataToEncrypt)
    }
    
    async readFromBike (bluetoothConnection: any, service: string, characteristic: string): Promise<Uint8Array> {
        console.log('read from bike')
        const genericAccessService = await bluetoothConnection.getService(service);
        const data = await genericAccessService.read(characteristic);
        const uint8Array = new Uint8Array(data);
        console.log(`Read ${uint8Array} from ${service} - ${characteristic}`)
        return uint8Array;
    }

    async writeToBike (bluetoothConnection: any, payload: any, service: string, characteristic: string, writeWithoutEncryption: boolean = false) {
        const genericAccessService = await bluetoothConnection.getService(service);
        if (!writeWithoutEncryption) {
            const data = await this.makeEncryptedPayload(bluetoothConnection, payload)
            await genericAccessService.write(characteristic, data);
            console.log(`Wrote with encryption ${data} to ${service} - ${characteristic}`)
        } else {
            await genericAccessService.write(characteristic, payload);
            console.log(`Wrote without encryption ${payload} to ${service} - ${characteristic}`)
        }
    }


    async getSecurityChallenge (bluetoothConnection: any): Promise<Uint8Array> {
        console.log('Get Security challenge')
        const nonce = await this.readFromBike(bluetoothConnection, '8e7f1a50087a44c9b292a2c628fdd9aa', '8e7f1a51087a44c9b292a2c628fdd9aa');
        console.log('Nonce Security challenge', nonce)
        return nonce;
    }

    async getMotorBatteryLevel (bluetoothConnection: any) {
        const motorBattery = await this.readFromBike(bluetoothConnection, '8e7f1a50087a44c9b292a2c628fdd9aa', '8e7f1a54087a44c9b292a2c628fdd9aa');
        const motorFinal = this.cryptService.decrypt(motorBattery)
        return motorFinal;
    }
}