import { ModeOfOperation, utils, ByteSource } from 'aes-js';
import * as aesjs from 'aes-js';


export default class vanmoofcrypto {
  _aes: ModeOfOperation.ModeOfOperationECB;
  _key: Uint8Array;
  _passcode: Uint8Array;
  //_aes: aesjs.ModeOfOperation;


  constructor(encryptionKey: string) {
/*
    this._aes = new ModeOfOperation.ecb(new Uint8Array(Buffer.from(encryptionKey, 'hex')))
    console.log(this._aes,'aes'); 
    const input = new Uint8Array(16); // Create a 16-byte array, or use your actual input data
    const encrypted = this._aes.encrypt(input);
    this.passcode = encrypted.slice(0, 6);
    console.log(this.passcode, 'passcode');
 */   
//VANLIB
    this._key = new Uint8Array(aesjs.utils.hex.toBytes(encryptionKey));
    //console.log(this._key,'key'); 

    this._passcode = this._key.subarray(0, 6);
    //console.log(this._passcode,'passcode'); 

   // this._aes = new ModeOfOperation.ecb(new Uint8Array(Buffer.from(encryptionKey, 'hex')))
    this._aes = new ModeOfOperation.ecb(this._key);
    //console.log(this._aes,'aes');
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