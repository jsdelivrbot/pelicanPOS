import { Injectable, NgZone } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { FastpassContact } from '../classes/fastpassContact';
import { PouchDBService } from '../providers/pouchdb.service';
import { User } from '../classes/user';
import { DateTime } from 'ionic-angular/components/datetime/datetime';
import { Crypto } from '../providers/crypto';
import { useAnimation } from '@angular/core/src/animation/dsl';
import { Merchant } from '../classes/merchant';
import { Operator } from '../classes/operator';
import { TransactionManager } from './TransactionManager';
import { TextEncoder } from 'text-encoding-shim';


/*
  Generated class for the fastpass provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class UserManager {

    private _currentUser:Operator;
    private remote: any = "http://127.0.0.1:5984/fastpass";
    data: any;
    db: PouchDBService;
    vendor:Merchant;



    constructor(private pouchDbService: PouchDBService, private crypto:Crypto, private zone:NgZone) {
        //setup pouchDb database and sync to remote
        this.db = pouchDbService;


        /*** not needed pulling it off the fetch in each Provider 
        //subscribe to User Changes
        this.db.getChangeListener().subscribe(data => {
            alert("DbChange Detected:");
            for(let i = 0; i < data.change.docs.length; i++) {
                let doc =  data.change.docs[i];

                if(!doc.type){
                    alert("Document with no type detected: "+JSON.stringify(doc));
                    return;
                }

                if(doc.type.toLowerCase().trim() == "User"){
                    alert("User change detected: "+JSON.stringify(doc));
                }
                else if(doc.type == "memberaccount.userpayment"){
                    alert("Payment detected: "+JSON.stringify(doc));
                    let tm:TransactionManager = null;
                    tm.getTransactions

                }
                else{
                    alert("Unhandled type detected: "+JSON.stringify(doc));
                }
                this.zone.run(() => {
                    this.people.push(data.change.docs[i]);
                });
            }
        });*/
    }

    create(id, displayName: string, phoneNumbers: string[]): Promise<User> {
        console.log(">>>> entered userManager_create()");


        let d = new User();
        d._id = id;
        d.displayName = displayName;
        d.phoneNumbers = ["8696621111", "8696621112"];

        console.log("userManager_create: d is: '" + JSON.stringify(d) + " '");
        return new Promise<User>(o => {
         this.db.put(id,d)
            .then(o => {
                console.log("**** userManager_create Put Document completed: '");
                return this.db.get(id);
             }).catch(ex => {
                 console.log("**** Caught in userManager_create: '" + JSON.parse(ex) + " '");
                 Promise.reject(ex);
                 throw ex;
             });
        });
    }

    set_CurrentUser(o:Operator) {
        this._currentUser = o;
    }

    //if a current user is activated return otherwise return null
    get_currentUser(): Operator {

        //if a user is currently 
        if (this._currentUser != null) {
            return this._currentUser;
        };

        return null;
    }


    //Get User By Id
    getUser(id: string): Promise<User> {
        return new Promise<User>((res,rej)=>{
             this.db.get(id).then(results => {
                res(results); 
            }).catch(ex => {
                console.log("Caught in userManager_getUser("+id+"): "+ ex);
                rej(ex);
            });
        });
    }
    

    //Reset the user status to have the sms resent, while logging attempts
    resendSMSVerification(user:User): Promise<User>{
        
        return new Promise<User>((res, rej)=>{
           
            //get the existing user record    
            this.db.get(user._id).then(u=>{

                //ensure user has a status set
                if(u.status){

                    //if the status is higher than waiting to be sent
                    if(u.status.code > 0){

                        //create/set the iteration of attempts
                        u.resendSMS = u.resendSMS? u.resendSMS++: 1;

                        //reset the status, changing message to resend ...
                        u.status = {code:0, message:'resending SMS Verification'};

                        //update the db record to trigger changes
                        this.db.put(u._id,u).then(o=>{

                            //send success object
                            res(o);
                        }).catch(err=>{

                            //error updating db object
                            
                            //set useful app message to send with rejection code
                            let msg = {message: "error updating db record to resend sms", error: err};
                            rej(msg);
                        });
                    }
                } // end if u.status
            }).catch(err=>{
                let msg = {message: "error getting user from database", error: err};
                rej(msg);
            }); // end database get and catch
        });  // end of new Promise<User>   
    }

    sendSMSVerification(user:User): Promise<User>{
        return new Promise<User>((res,rej)=>{
            // verify unique user name:
            this.getUser(user._id).then(o=>{
                console.log(" ***** userManager.verifyUserInfo("+JSON.stringify(user)+"): ERROR user IS found: "+ JSON.stringify(o));
                rej({"user":o, message: "User already exists in the system, sign-in or use forgot password"});
            }).catch(err=>{
                console.log(" >>>>> userManager.sendSMSVerification("+JSON.stringify(user)+"): user not found: "+ JSON.stringify(err));

                //check to verify that the error message is not found!
                this.sendSMS(user).then(o=>{
                    console.log(" >>>>> userManager.sendSMSVerification(user): sendSMS successful: "+ JSON.stringify(o));
                    res(o);
                }).catch((err)=>{
                    console.log(" *****  userManager.sendSMSVerification(user): sendSMS error: "+ JSON.stringify(err));
                    rej(err);
                });
            });



            //send SMS verification
        });
    }

    private sendSMS(user:User):Promise<any>{

        return new Promise<any>((smsResult,smsReject)=>{
            let doc:any = user;
            doc.status = {code:0, message:"awaiting verification"};

            this.db.put(user._id,user).then(o=>{
                console.log(" >>>>>>  userManager.sendSMS(): sent "+JSON.stringify(o));
                smsResult(o);
            }).catch((ex)=>{
                console.log(" ***** userManager.sendSMS(): error "+JSON.stringify(ex));
                smsReject(ex);
            });
        });

    }


    validate(user:User): Promise<User>{
        return new Promise<User>((res,rej)=>{
            // verify unique user name:
            this.db.get(user._id).then(o=>{
                let status = {code: 2, message:'User Validated', date:new Date().toISOString()};
                o.status = status;
                
                //update db object with validated status information
                this.db.put(o._id,o).then(nu=>{
                    console.log(" >>> userManager.validate() validated user successfully");
                    res(nu);
                }).catch(err=>{
                    console.log(" ****** userManager.validate() Error updating validated user in database");
                    let msg = {message:' Error updating validated user in database', error:err};
                    rej(msg);
                });
            }).catch(err=>{
                console.log(" >>>>> userManager.validate("+JSON.stringify(user)+"): Error getting User from database: "+ JSON.stringify(err));
            });
        }); // end of promise
    }

    forgotPassword(userId:string){
        this.getUser(userId).then(o=>{
            //TODO: Implement FORGOT PASSWORD PAGE AND DATA
        })
    }

    setPin(pin:string):Promise<Uint8Array>{
        console.log(">>>>>>>>>>>>>> userManager.setPin()");


        return new Promise<Uint8Array>((res,rej)=>{
                try{
                let val:Uint8Array = null;

                this.crypto.deriveAesKey(pin).then(()=>{
                    console.log("userManager set pin: e1");
                    this.crypto.encrypt(pin).then(r2=>{
                        console.log("userManager set pin: e2");
                        res(r2);
                    });
                });
            }catch(err){rej(err);}
        });
    }

    getPin(user:any):Promise<string>{

        return new Promise<string>((res,rej)=>{
            //console.log(">>>>> userManager.getPin(user) user: "+JSON.stringify(user));


            this.pouchDbService.database.get(user._id).then(o=>{

                let p = new Uint8Array(o);

            let pin:string = "";
            //let str = JSON.stringify(user.pin);
            //let test:any[] =  (user.pin as any);


            //console.log("compare: ret: '"+JSON.stringify(ret)+"; with pin: '"+ JSON.stringify(user.pin)+"'");
            //console.log("compare: ret len: '"+ret.length+"; with pin len: '"+ JSON.stringify(user.pin.length)+"'");
            //console.log(">>>>> userManager.getPin(user) p: " + JSON.stringify(ret)); 
//            console.log(">>>>> userManager.getPin(user) p.length: " +ret.length); 
            this.crypto.decrypt(o.pin).then(b=>{
                console.log(">>>>> userManager.getPin(user) user: "+JSON.stringify(user)+" decrypted value is: "+JSON.stringify(b));
                pin= b;
                res(b);
            });
        }).catch(err=>{
            console.log(">>>>> userManager.getPin(): error "+JSON.stringify(err));
            rej(err);
        });
    
        });
        
    }

    get_AvailableBalance(user:User){
        
    }
}
