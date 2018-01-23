import { User } from "../classes/user";
import { Injectable } from "@angular/core";
import { PouchDBService } from "../providers/pouchdb.service";
import { Merchant } from "../classes/merchant";
import { retry } from "rxjs/operator/retry";
import { UserManager } from "../providers/userManager";

@Injectable()
export class MerchantManager{

    localMerchants:Merchant[] = []; // list of all local merchants configured for this system
    private _currentMerchant:Merchant = null; //current merchant in use.

    



    constructor(public fastPassDb:PouchDBService, public userManager:UserManager){
        //check database for local Merchant Object
        /*
        this.localMerchants = fastPassDb.get('_local/merchant');
        if(this.localMerchants){
            //local merchants found
            if(this.localMerchants.length == 1){
                //if only one merchant found make it current
                this.set_CurrentMerchant(this.localMerchants[0]);
            }

        }
        */
    }

    get_CurrentMerchant():Merchant{
        alert("getting merchant");
        return this._currentMerchant;
    }

    set_CurrentMerchant(merchant:Merchant){
        this._currentMerchant = merchant;
    }

    setOperatorAsCurrent(operatorPassword:string):boolean{

        console.log("merchantManager.setOperatorAsCurrent("+operatorPassword+")");
        let isAuth:boolean = false;

        let opPos:number = parseInt(operatorPassword.substring(0,3));
        console.log("merchantManager.setOperatorAsCurrent("+operatorPassword+"): opPos: "+opPos);
        let password:string = operatorPassword.substring(3);
        console.log("merchantManager.setOperatorAsCurrent("+operatorPassword+"): password: "+password);
        let u:User = this._currentMerchant.operators[opPos];
        console.log("merchantManager.setOperatorAsCurrent("+operatorPassword+"): user: "+JSON.stringify(u));
        
        let p = this.userManager.getPin(u);
        if(p == password){
            console.log("merchantManager.setOperatorAsCurrent("+operatorPassword+"): user.password: "+ p);
            isAuth = true;
            this.userManager.set_CurrentUser(u);
        } 
        return isAuth;
    }


 

 
    get_Merchant(merchantId:string):Merchant{
        
        let m:Merchant = this.fastPassDb.get(merchantId);
        return m;
    }


    operators:User[] = []; // list of authorized users

    
}