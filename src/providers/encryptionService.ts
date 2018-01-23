'use strict';

import Encrypt from 'jsencrypt';
import Decrypt from 'jsencrypt';
import asmCrypto from 'asmcrypto.js'; 
import { Injectable } from '@angular/core';

@Injectable()
export class EncryptionService {

    private aeskey:any;
    private salt:string = "12345";
    private iterations = 4096;
    private nonceLen = 12;
    
    private encrypter:any;

    constructor(){
    }


    setPassword(password:string){
        this.deriveAesKey(password);
    }


    decryptString(encryptedData:any){
        try{
            let bytes =  this.decrypt(encryptedData);
            let str = asmCrypto.bytes_to_string(bytes);
            return str;
        }catch(ex){
                
        }

    }

    decryptObj(encryptedData:any){
        let str = this.decryptString(encryptedData);
        return JSON.parse(str);
    }


    decrypt(buffer:Uint8Array){
        const parts = this.separateNonceFromData(buffer);
        const decrypted = asmCrypto.AES_GCM.decrypt(parts.data, this.aeskey, parts.nonce);
        return decrypted;
    }


    separateNonceFromData(buffer:Uint8Array){
        const nonce = new Uint8Array(this.nonceLen);
        const data = new Uint8Array(buffer.length - this.nonceLen);
        buffer.forEach((byte, i) => {
          if (i < this.nonceLen) {
            nonce[i] = byte;
          } else {
            data[i - this.nonceLen] = byte;
          }
        });
        return {nonce, data};          
    }


    encrypt(data:any){
        let nonce = new Uint8Array(this.nonceLen);
        asmCrypto.getRandomValues(nonce);

        let encrypted = asmCrypto.AES_GCM.encrypt(data, this.aeskey, nonce);
        return this.joinNonceAndData(nonce, new Uint8Array(encrypted));
    }


    joinNonceAndData(nonce: Uint8Array, data: Uint8Array) {
        const buf = new Uint8Array(nonce.length + data.length);
        nonce.forEach((byte, i) => buf[i] = byte);
        data.forEach((byte, i) => buf[i + nonce.length] = byte);
        return buf;
      }

    
      


  
  
      deriveAesKey(password: string) {
    this.aeskey = asmCrypto.PBKDF2_HMAC_SHA256.bytes(password, this.salt, this.iterations, 32);
  }


} 

