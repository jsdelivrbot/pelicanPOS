import { OrderItem } from '../classes/orderItem';
import { Order } from './../classes/order';
import { retry } from 'rxjs/operator/retry';
import { Item } from './../classes/Item';
import { Injectable } from '@angular/core';
import { Basket } from '../classes/basket';
import { PayMethod } from '../classes/paymethod';
import { Transaction } from '../classes/transaction';
import { DatabaseProvider } from '../providers/databaseProvider';
import { fakeAsync } from '@angular/core/testing';
import {ScanPage} from '../pages/scan/scan';
import { UserData } from '../classes/userData';
import { PouchDBService } from '../providers/pouchdb.service';
import {HTTP} from '@ionic-native/http';
import { User } from '../classes/user';
import { UserManager } from '../providers/userManager';
import {Config} from '../providers/configProvider';
import { Response } from '@angular/http/src/static_response';
import { MerchantManager } from '../providers/merchantManager';
import { Operator } from '../classes/operator';
import { Merchant } from '../classes/merchant';




@Injectable()
export class TransactionManager{

    //POS Variables
    _currentOrderIndex = -1;
    orders: any[] = [];
    orderStatus:any = {items:0, message:"No Sale"};
    userData:UserData;

    //Transaction Variables
    fromAccount:Account;
    toAccount: Account;
    data: any;
    Drs: any[];
    Crs: any[];

    private _transaction:Transaction;



 
    constructor(public fastpassDB:PouchDBService, private db:DatabaseProvider, public userManager:UserManager,
         public merchantManager:MerchantManager, public http:HTTP,public config:Config){
            alert("TransManager Constructor called: checking to see how often");
//--------------
if(this.merchantManager.get_CurrentMerchant()){
    let relevantId = this.merchantManager.get_CurrentMerchant()._id;
    //update transaction List on Change
    this.db.getChangeListener().subscribe(data => {
        //at this point we have all changes in the database regardless of relevance
        let doc:any = data.changes.doc;
        if(doc.type.toLowerCase().trim() == "memberaccount.userpayment"){
        
            if((doc.subject == this.userManager.get_currentUser()._id) ||(doc.to._id == relevantId)) {
                //this doc is a transaction and is either a dr or cr to this merchant Account
                this.updateTransactions();
            }
        }
    });
    // call during constructor;
    //alert("updating transaction during constructor")
    this.updateTransactions();
}
//----------------
        this.getSaleStatus().then(stat=>{
            this.orderStatus = stat;
        });


    }//this.loadItems();



    /******************************************************************************** 
    //POS METHODS
    *******************************************************************************/
    

    private createOrder(){
        try{
            //create a new order
           //console.log(">> TransManager.createOrder()");
           //console.log(">> TransManager.createOrder()>> current length is: "+ JSON.stringify(this.orders));
            let o = new Order();
            let len = this.orders.push(o);
           //console.log(">> TransManager.createOrder()>len is: "+len);
            this._currentOrderIndex = (len -1);
           //console.log(">> TransManager.createOrder()>index is: "+ this._currentOrderIndex);
        }catch(ex){
           //console.log(">> TransManager.createOrder() ERROR ADDING TO ORDER: "+ ex);
            
        }

    }

     addToOrder(item:Item, toSave?:boolean){

        //if no tosave value is parsed then save automatically
        if(!toSave){
            toSave = true;
        }


       //console.log(">>> transManager.addToOrder(item): "+JSON.stringify(item));
         //if there is no current order create one
         if(this._currentOrderIndex == -1){
           //console.log(">>> transManager.addToOrder(item) >> Have to create order: ");
            //create a new order
            this.createOrder();
           //console.log(">>> transManager.addToOrder(item) >> Order Created: ");
        }
       //console.log(">>> transManager.addToOrder(item) >> About to add to CurrentOrder with index of : "+JSON.stringify(this.currentOrder()));
        

        //add current order and added item to database
        this.currentOrder().addItem(item);

        //some bulk processes will save at the end
        if(toSave){
            this.order_save();
        }
     }

     currentOrder():Order{
         //console.log(">>> Transmanager.currentOrder().this._currentOrderIndex: "+ this._currentOrderIndex)
         let val:Order = this.orders[this._currentOrderIndex];
          return val;   
     }
     
     order_save(order?:Order):Promise<any>{

        return new Promise<any>((resolve, reject)=>{

            //if no order sent use the current order
            if(!order){
                order = this.currentOrder();
            }



            this.db.put(order._id,order).then( o=>{
                order._rev = o._rev;
                ">>> TransManager.order_save() SUCCESS: "+ JSON.stringify(order);
                resolve(order);
            }).catch(ex=>{
                "*** TransManager.order_save() ERROR: "+ex;
                reject(ex);
            });
    
    
        });
   
     }

     getSaleStatus():Promise<any>{
        //console.log(">>> TransManager.getSalesStatus()");
        return new Promise((respond, reject)=>{
           //console.log(">>> TransManager.getSalesStatus() in promise");
            
            try{
                this.orderStatus = {items:0, message:"No Sale"}; 
               //console.log(">>> TransManager.getSalesStatus() in try"+JSON.stringify(this.orderStatus));
               //console.log(">>> TransManager.getSalesStatus() this._currentOrderIndex: "+this._currentOrderIndex);
                
                //if there is no current order
                if(this._currentOrderIndex == -1){
                   //console.log(">>> TransManager.getSalesStatus() => there is no current order");
                    this.orderStatus =  {items:0, message:"No Sale"};
                }
                else{
                   //console.log(">>> TransManager.getSalesStatus() => counting");
                    let count = this.currentOrder().currentBasket().orderItems.length;
                    let message = "Current Sale";
                    this.orderStatus = {"items":count, "message":message};
                }
               //console.log(">>> TransManager.getSalesStatus() => res: "+JSON.stringify(this.orderStatus));
                respond(this.orderStatus);
    
            }catch(ex){
               //console.log(">>> TransManager.getSalesStatus() => error: "+ex);
                reject(ex);
            }
            

        });
    }

    get_OrderItem_Total(orderItem:OrderItem):number{
                    try{
                        let price:number = 0;
                        if(!orderItem.value || !orderItem.quantity){
                           //console.log(">> OrderItem ("+orderItem.title+") has no value");
                            return price;
                        }
                       //console.log(">> OrderItem.total() started");
                        price = (orderItem.quantity * orderItem.value);
                       //console.log(">> OrderItem ("+orderItem.title+").total() = qty: "+ orderItem.quantity+" + value: "+ orderItem.value + "= "+price);
                        return price;
                    }
                    catch(ex){
                       //console.log(">> transManager.get_OrderItem_Total() ERROR: " + ex);
                    }
            }


        get_ItemTotal(item:Item):number{
            return 0;
        }


        removeItem(item:Item, basket?:Basket, toSave:boolean = true):Promise<boolean>{

            if(!toSave){}
            return new Promise<boolean>((resolve,reject)=>{
                let b:Basket = basket;
                try{
                    
                    if(!b){
                        b = this.currentOrder().currentBasket();
                    }
                    let index = b.orderItems.indexOf(item);
                    b.orderItems.splice(index,1);

                    //if not part of a bulk operation then save item after removal.
                    if(toSave){
                        this.order_save();
                    }

                    //no need to remove the current OrderItem from the database as it is only part of an order entry
                }catch(ex){
                   //console.log("*** ERROR in TransactionManager.removeItem(item:'"+ JSON.stringify(item)+"):  from: "+JSON.stringify(b)+"with message: "+ ex);
                    reject(ex);
                }

            });
        }


    /******************************************************************************** 
    //PAYMENT METHODS
    *******************************************************************************/


    availableBalance(ownerId:string):Promise<any>{
  
        return new Promise<any>((res,rej)=>{
            let params = {grouplevel:1,
                key:ownerId,
                group:true
            };
    
            let bal:any = [];
            
            this.fastpassDB.query("transactions/get_transactionBalanceByUser",params).then(o=>{
                //alert("TransactionManager.availableBalance("+ownerId+"): Updating Balances: "+JSON.stringify(o));
                bal = o.rows;
                res(bal);
            });
    
        });
    }

    updateTransactions(){

        let relevantId = this.merchantManager.get_CurrentMerchant()._id;
        let params = {grouplevel:1,
            key:relevantId,
            include_docs:true,
            group:true
        };

        this.data = this.fastpassDB.query("transactions/get_transactionsByUser",params).then(o=>{
            //alert("TransactionManager.updateTransactions("+relevantId+"): Updating transactionList: "+JSON.stringify(o));
            this.data = o.rows;
        });
        //alert("TransactionManager.updateTransactions("+ownerId+"): Updating transactionList outside of then");
    }
    get_PayMethods():PayMethod[] {
        let paymethods:PayMethod[] = [];

        let pm1 = new PayMethod();
        pm1.icon="cash";
        pm1.name="Cash";
        pm1.page = {
            "instruction":"Enter the amount tendered",
            "allowEntry":true
        };

        let pm2 = new PayMethod();
        pm2.icon="card";
        pm2.name="Credit Card";
        pm2.page = {
            "instruction":"Enter the amount tendered",
            "allowEntry":true
        };

        let pm3 = new PayMethod();
        pm3.icon="list";
        pm3.name="FASTPass";
        pm3.route = ScanPage;
        let rules = {
            isValid:{
                time:3000
            }

        };
        pm3.rules = rules;
        pm3.page = {
            "instruction":"Scan your FastPASS Code",
            "allowEntry":true
        };

        paymethods.push(pm1);
        paymethods.push(pm2);
        paymethods.push(pm3);
        return paymethods;
    }

    /******************************************************************************** 
    //TRANSACTION METHODS
    *******************************************************************************/

    get_currentTransaction(){
        if(this._transaction == null){
            this._transaction = new Transaction();
        }
        return this._transaction;
    }

    set_transactionAmount(amount:number, currency:String){
        this.get_currentTransaction();
        this._transaction.amount = amount;
    }


    set_transactionDescription(description:string){
        this.get_currentTransaction();
        this._transaction.description = description;
        
    }
        

    set_transactionSubject(subject:string){
        this.get_currentTransaction();
        this._transaction.subject = subject;
        
    }
        
    set_transactionTo(to:string){
        this.get_currentTransaction();
        this._transaction.to = to;
        
    }
        
        
    set_transactionType(type:string){
        this.get_currentTransaction();
        this._transaction.type = type;
        
    }
        
       
    set_transactionOrder(order:Order){
        this.get_currentTransaction();
        this._transaction.order = order;
        
    }
        

        
    set_Transaction(amount:number, currency:string, description:string, order:any){
        this.get_currentTransaction();
        this._transaction.amount = amount;
        this._transaction.currency = currency;
        this._transaction.description = description;        
        this._transaction.order = order;
    }
        

    private makeTransaction(TransactionType: string, to: any, amount: number, comment: string, currency: string = "XCD", scheduling: string = "direct"): any {
        console.log(">>> Entered transactionManager.makeTransaction()");
        let MyDate = new Date();
        console.log(">>> transactionManager.makeTransaction(): mydate: "+MyDate);
        
        let showDate = MyDate.getFullYear()
            + '-' + ('0' + (MyDate.getMonth() + 1)).slice(-2)
            + '-' + ('0' + MyDate.getDate()).slice(-2)
            + '@' + MyDate.getHours()
            + ('0' + MyDate.getMinutes()).slice(-2)
            + ('0' + MyDate.getSeconds()).slice(-2);
 
            console.log(">>> transactionManager.makeTransaction(): showDate: "+showDate);
            
            let myProfile: Merchant = this.merchantManager.get_CurrentMerchant();
            console.log(">>> transactionManager.makeTransaction(): myProfile: "+JSON.stringify(myProfile));
            
            console.log(">>>>  transactionManager.makeTransaction(): CurrentMerchant: " + JSON.stringify(myProfile._id));

        let d = {
            "_id": myProfile._id + "_" + to._id + "_" + showDate,
            "amount": amount.toString(),
            "description": comment,
            "currency": currency,
            "type": "memberaccount.userpayment",
            "subject": myProfile._id,
            "to": to,
            "scheduling": scheduling,
            "transactionType": TransactionType
        };
        return d
    }

    
    topup(recipientId:string, amount:number):Promise<Transaction>{
        console.log(" >>>  Entering transactionManager.topup() about to determine topup type: ");

        let results:any
        return new Promise<Transaction>((resolve, reject) => {

            //set transaction variables

            let sender = this.merchantManager.get_CurrentMerchant()._id;
            let to:User = new User();
            
            console.log(" >>>  transactionManager=>topup() sender: " + sender);

            let aBal = this.availableBalance(sender);
            let aBalance:number;

            aBal.then(v=>{
                aBalance = v.value;

                console.log(" >>>  transactionManager=>topup() availableBalance: " + JSON.stringify(aBal));

                console.log(" >>>  transactionManager=>topup() recipientId: " + recipientId);

            
            this.userManager.getUser(recipientId).then(o=>{
                alert("user Found");
                to = o;
            }).catch(err=>{
                alert("user not Found... making one");
                to._id = recipientId;
                to.displayName ="Unknown User";
                to.group = "User";
                to.phoneNumbers.push(recipientId);
            }).then(()=>{
                
                alert("we have recipient object now go ahead");
                //generate the transaction
                let t = this.makeTransaction("topup",to, amount, "Fastpass instore topup from: "+this.merchantManager.get_CurrentMerchant()._id+ " to: "+recipientId);
                alert("Transaction will be: "+JSON.stringify(t));
                console.log(" >>>  transactionManager=>topup() t: " + JSON.stringify(t));
            
                
                console.log(" >>>  transactionManager=>topup() transaction Amount: " + JSON.stringify(amount));
                console.log(" >>>  transactionManager=>topup() Available Balance: " + JSON.stringify(sender));
                //console.log(" >>>  transactionManager=>topup() Credit: " + JSON.stringify(this.userData.credit));
    
                //if the transaction amount is greater than available spending facility then reject
                if(amount > aBalance){
                    let e:Transaction = new Transaction();
                    e.statusCode = 400;
                    e.status = "Insufficient funds";
                    console.log(" *********  transactionManager=>topup() error NSF Balance is: " + (aBalance));
                    reject(e);
                }
    
                console.log(" >>>>>>  transactionManager=>topup()  Balance is Good: " + amount+" of: "+(aBalance));
    
                this.fastpassDB.put(t._id, t).then((data) => {
                    console.log("transactionManager=>topup: local save completed of data:'" + JSON.stringify(t) + "'");
                    results = { "status": "success", "message": JSON.stringify(t) };
                    console.log(">>>>>>> TransactionManager => topup created: " + JSON.stringify(results));
                    resolve(results);
    
    
                }).catch((error) => {
                    results = results = { "status": "error", "message": JSON.stringify(error) };
                    console.log("**** TransactionManager.topup() error: saving to fastpassdb:  " + error);
                    reject(results);
    
                });
            });

        });
                

    });
 

    }

    tender():Promise<Transaction>{
                try{
                    alert("tender");
                    console.log(" >>>  Entering transactionManager.tender() about to makeTransaction: ");
                    let results:any

                    return new Promise((resolve, reject) => {

                        //generate the transaction
                        console.log(" >>>  Entering transactionManager.tender() UserManager: : "+JSON.stringify( this.merchantManager.get_CurrentMerchant()));
                        let t = this.makeTransaction("payment", this.merchantManager.get_CurrentMerchant(), this._transaction.amount, JSON.stringify( this.currentOrder().getOrderItemsByBasketQty(true)), "purchase at POS", this._transaction.currency);
                        console.log(" >>>  transactionManager=>tender() t: " + JSON.stringify(t));

                        //if the transaction amount is greater than available spending facility then reject
                        if(this._transaction.amount > (this.userData.availablebalance+this.userData.credit)){
                            let e:Transaction = new Transaction();
                            e.statusCode = 400;
                            e.status = "Insufficient funds";
                            reject(e);
                        }
                        this.fastpassDB.put(t._id, t).then((data) => {
                            console.log("transactionManager=>transferFunds: local save completed of data:'" + JSON.stringify(t) + "'");
                            results = { "status": "success", "message": JSON.stringify(t) };
                            console.log(">>>>>>> TransactionManager => transferFunds created: " + JSON.stringify(results));
                            resolve(results);
            
            
                        }).catch((error) => {
                            results = results = { "status": "error", "message": JSON.stringify(error) };
                            console.log("**** TransactionManager.tender() error: saving to fastpassdb:  " + error);
                            reject(results);
            
                        });
                    });
                    
                }catch(ex){
                    console.log("**** TransactionManager.tender() error trying to tender transaction:  " + ex);
                }
            }

        
/**************************************************************************************************
 * TRANSACTION LIST METHODS
****************************************************************************************************/

//get live list of transactions.
getTransactions(){
    if(this.data){
        return Promise.resolve(this.data);
    }
    return new Promise(resolve =>{
        this.fastpassDB.fetch().then((result)=>{
            this.data = [];
            let docs = result.rows.map((row)=>{
                this.data.push(row.doc);
            });
        });
        resolve(this.data);
        this.db.changes({live:true, since:'now', include_docs:true }).on('change',(change)=>{
            this.handleChange(change);
        });
    }).catch(err=>{
        console.log("************* TransactionManager.getTransactions() error: "+ JSON.stringify(err));
    });

}


handleChange(change:any){
    let changedDoc = null;
    let changedIndex = null;
   
    this.data.forEach((doc, index) => {
   
      if(doc._id === change.id){
        changedDoc = doc;
        changedIndex = index;
      }
   
    });
   
    //A document was deleted
    if(change.deleted){
      this.data.splice(changedIndex, 1);
    }
    else {
   
      //A document was updated
      if(changedDoc){
        this.data[changedIndex] = change.doc;
      }
   
      //A document was added
      else {
        this.data.push(change.doc);
      }
   
    }    
}
/**************************************************************************************************
 * END OF TRANSACTION LIST METHODS
****************************************************************************************************/

}

