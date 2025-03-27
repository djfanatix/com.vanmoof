"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const aes_js_1 = require("aes-js");
const aesjs = __importStar(require("aes-js"));
class vanmoofcrypto {
    //_aes: aesjs.ModeOfOperation;
    constructor(encryptionKey) {
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
        this._aes = new aes_js_1.ModeOfOperation.ecb(this._key);
        //console.log(this._aes,'aes');
    }
    getKey() {
        return this._key;
    }
    encrypt(bytes) {
        return this._aes.encrypt(bytes);
    }
    decrypt(bytes) {
        return this._aes.decrypt(bytes);
    }
    getPasscode() {
        return this._passcode;
    }
    getUtils() {
        return aes_js_1.utils;
    }
}
exports.default = vanmoofcrypto;
//# sourceMappingURL=vanmoofcrypto.js.map