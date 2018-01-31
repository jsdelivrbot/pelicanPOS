import { Account } from '../classes/account';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Card } from '../classes/card';


export class User2{

	 _id:string;
	 _rev:string;
     phoneNumbers: string[] = [];
     name:string;
     username:string;
     email:string;
     sources:Card[];
     password = "";
     pin:Uint8Array = null;
     securityQuestions = {"question1":"", "question2":"","question3":"","answer1":"","answer2":"","answer3":"",}
    
    displayName: string;
    activeAccount: Account;
    type = "User";

    cyclosUser:any;

    constructor() { 

        /*
        this.cyclosUser = {
            "name": "string",
            "username": "string",
            "email": "string",
            "customValues": {},
            "hiddenFields": [
              "string"
            ],
            "group": "string",
            "addresses": [
              {
                "name": "string",
                "addressLine1": "string",
                "addressLine2": "string",
                "street": "string",
                "buildingNumber": "string",
                "complement": "string",
                "zip": "string",
                "poBox": "string",
                "neighborhood": "string",
                "city": "string",
                "region": "string",
                "country": "string",
                "location": {
                  "latitude": 0,
                  "longitude": 0
                },
                "defaultAddress": true,
                "hidden": true
              }
            ],
            "mobilePhones": [
              {
                "name": "string",
                "number": "string",
                "extension": "string",
                "hidden": true,
                "enabledForSms": true,
                "verified": true,
                "kind": "landLine"
              }
            ],
            "landLinePhones": [
              {
                "name": "string",
                "number": "string",
                "extension": "string",
                "hidden": true,
                "enabledForSms": true,
                "verified": true,
                "kind": "landLine"
              }
            ],
            "passwords": [
              {
                "type": "string",
                "value": "string",
                "checkConfirmation": true,
                "confirmationValue": "string",
                "forceChange": true
              }
            ],
            "images": [
              "string"
            ]
          };
    
        
        */
    }
}
