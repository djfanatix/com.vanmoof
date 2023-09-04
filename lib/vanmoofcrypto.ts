import { ModeOfOperation, utils, ByteSource } from 'aes-js';
import * as aesjs from 'aes-js';


export default class vanmoofcrypto {
  _aes: ModeOfOperation.ModeOfOperationECB;
  _key: Uint8Array;
  _passcode: Uint8Array;

  constructor(encryptionKey: string) { 
//BASED ON VANLIB
    //MANUALLY ADD encryption key  
    const encryptionKey = 'xxx';
    //MANUAL
    this._key = new Uint8Array(aesjs.utils.hex.toBytes(encryptionKey));
    this._passcode = this._key.subarray(0, 6);
    this._aes = new ModeOfOperation.ecb(this._key);

  }

  getKey() {
    return this._key
  }
  encrypt(bytes: ByteSource) {
    return this._aes.encrypt(bytes)

  }

  decrypt(bytes: ByteSource) {
    return this._aes.decrypt(bytes)

  }

  getPasscode(): Uint8Array {
    return this._passcode;
}

  getUtils() {
    return utils
  }

}