import { Injectable } from "@angular/core";
import { TextEncoder, TextDecoder, TextEncoder_Instance } from 'text-encoding-shim';



@Injectable()
export class Crypto{
 
    private aesKey: CryptoKey;
    private salt = "This is the salt. It does not have to be secret";
    private iterations = 1000;
    private ivLen = 16;
    private textEncoder = new TextEncoder("utf-8");
    private textDecoder = new TextDecoder("utf-8");


    constructor(){
      this.deriveAesKey("1234");
    }

    genSalt(){
      let s  = Math.random() * 1000000000;
      console.log("new salt is: "+ s );
      return s;
    }
 
    deriveAesKey(password: string) {
      return window.crypto.subtle.importKey(
        "raw",
        this.textEncoder.encode(password),
        {"name": "PBKDF2"},
        false,
        ["deriveKey"])
        .then(baseKey =>
          window.crypto.subtle.deriveKey({
              "name": "PBKDF2",
              "salt": this.textEncoder.encode(this.salt),
              "iterations": this.iterations,
              "hash": 'SHA-256'
            },
            baseKey,
            {"name": "AES-GCM", "length": 128},
            false,
            ["encrypt", "decrypt"]
          )
        )
        .then(aesKey => {
          this.aesKey = aesKey;
        });
    }
  
    joinIvAndData(iv: Uint8Array, data: Uint8Array) {
      const buf = new Uint8Array(iv.length + data.length);
      iv.forEach((byte, i) => buf[i] = byte);
      data.forEach((byte, i) => buf[i + iv.length] = byte);
      return buf;
    }
  
    separateIvFromData(buf: Uint8Array) {
      const iv = new Uint8Array(this.ivLen);
      const data = new Uint8Array(buf.length - this.ivLen);

      /*
      buf.forEach((byte, i) => {
        if (i < this.ivLen) {
          iv[i] = byte;
        } else {
          data[i - this.ivLen] = byte;
        }
      });
      return {iv: iv, data: data};
      */

      console.log("Crypto.separateIvFromData("+JSON.stringify(buf)+")");
     for(let i=0; i < buf.length; i++){
      let byte = buf[i];

      if (i < this.ivLen) {
        iv[i] = byte;
      } else {
        data[i - this.ivLen] = byte;
      }
    }
    return {iv: iv, data: data};
    }
  
    encrypt(data):PromiseLike<Uint8Array> {
      const initializationVector = new Uint8Array(this.ivLen);
      crypto.getRandomValues(initializationVector);
      return crypto.subtle.encrypt({
          name: 'AES-GCM',
          iv: initializationVector
        },
        this.aesKey,
        this.textEncoder.encode(data)
      ).then(encrypted => this.joinIvAndData(initializationVector, new Uint8Array(encrypted)));
    }
  
    decrypt(buffer: Uint8Array): Promise<string> {
      console.log(">>>>> crypto.decrypt(bufferd): ");
      
      return new Promise<string>((res,rej)=>{

        if(buffer.length == 0){
          rej("no pin detected")
        }
        const parts = this.separateIvFromData(buffer);
        console.log(">>>>> crypto.decrypt(bufferd): parts ");

          
        console.log(">>>>> crypto.decrypt(bufferd): about to decrypt ");
        return window.crypto.subtle.decrypt({
            name: "AES-GCM",
            iv: parts.iv
          },
          this.aesKey,
          parts.data
        ).then(decryptedBuffer => {
          console.log(">>>>> crypto.decrypt(bufferd): have decryptBuffer ");
          const decryptedString = this.textDecoder.decode(new Uint8Array(decryptedBuffer));
          console.log(">>>>> crypto.decrypt(bufferd): decryptedString: " + decryptedString);
          res(decryptedString);
        });
    });
  }
}