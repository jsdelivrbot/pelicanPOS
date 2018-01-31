import { User } from "../classes/user";
import { Injectable } from "@angular/core";
import { PouchDBService } from "../providers/pouchdb.service";
import { Merchant } from "../classes/merchant";
import { retry } from "rxjs/operator/retry";
import { UserManager } from "../providers/userManager";
import { Operator } from "../classes/Operator";
import { Terminal } from "../classes/terminal";

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

    get_localMerchants():Promise<Terminal>{

        return new Promise<Terminal>((res,rej)=>{

            this.fastPassDb.get('_local/fastPassPOS').then(o=>{
                res(o);
            }).catch(err=>{
                rej(err);
            });
        });
    }

    set_localMerchants(data:Terminal):Promise<any>{

        return new Promise<any>((res,rej)=>{

            this.fastPassDb.put('_local/fastPassPOS',data).then(o=>{
                res(o);
            }).catch(err=>{
                rej(err);
            });
        });
    }
    
    get_CurrentMerchant():Merchant{
        //alert("getting merchant: "+JSON.stringify(this._currentMerchant));
        return this._currentMerchant;
    }

    set_CurrentMerchant(merchant:Merchant){
        //alert("Setting merchant");
        this._currentMerchant = merchant;
    }


    setOperatorAsCurrent(operatorPassword:string):Promise<boolean>{
        return new Promise<boolean>((res,rej)=>{
            console.log("merchantManager.setOperatorAsCurrent("+operatorPassword+")");
            let isAuth:boolean = false;

            let opPos:number = parseInt(operatorPassword.substring(0,3));
            console.log("merchantManager.setOperatorAsCurrent("+operatorPassword+"): opPos: "+opPos);
            
            let password:string = operatorPassword.substring(3);
            console.log("merchantManager.setOperatorAsCurrent("+operatorPassword+"): password: "+password);
            
            let u:Operator = this._currentMerchant.getOperators()[opPos-1];
            console.log("merchantManager.setOperatorAsCurrent("+operatorPassword+"): user: "+JSON.stringify(u));
            
            if(!u){
                rej(isAuth);
                return isAuth;
            }

            let p:string = "";

            //get decrypted pin from user
            this.userManager.getPin(u).then(o=>{
                console.log("merchantManager.setOperatorAsCurrent("+operatorPassword+"): o is: "+ o);
                if(o == password){
                    console.log("merchantManager.setOperatorAsCurrent("+operatorPassword+"): user.password: "+ o);
                    isAuth = true;
                    this.userManager.set_CurrentUser(u);
                    res(true);
                }else
                {
                    console.log("*********** merchantManager.setOperatorAsCurrent("+operatorPassword+"): No Match:  user.password: "+ o +" != "+ password);
                    isAuth = false;
                } 
                res(isAuth);
            }).catch(err=>{
                console.log("*************** merchantManager.setOperatorAsCurrent("+operatorPassword+"):getPin Error: "+ JSON.stringify(err));
                res(isAuth);
                
            });

        });
    }


 

 
    get_Merchant(merchantId:string): Promise<Merchant>{
        console.log(">>>>> MerchantManager.get_Merchant("+ merchantId+") here");

        return new Promise<Merchant>((res,rej)=>{

            //get data from database
            let d = this.fastPassDb.get("javajive".toLowerCase().trim()).then(d=>{
                //data recieved
                console.log("MerchantManager.get_Merchant("+ merchantId+")> d: "+JSON.stringify(d));
                
                //get merchant object with methods from data
                let m:Merchant = Merchant.setData(d);
                console.log("MerchantManager.get_Merchant("+ merchantId+")> m: "+JSON.stringify(m));
                //response with the populated merchant object
                res(m)
                }).catch(err=>{
                    //if error anywhere in the process
                    console.log("MerchantManager.get_Merchant("+ merchantId+")> d: "+JSON.stringify(d));
                    rej(null);
                });
    
        });
    }
    save(merchant:Merchant):Promise<Merchant>{
        return new Promise<Merchant>((response, reject)=>{

            try{
                let m:Merchant = this.fastPassDb.put(merchant._id,merchant);
                response(m);

            }catch(err){
                reject(err);
            }
    
        });
        
    }

    operators:User[] = []; // list of authorized users

    
}