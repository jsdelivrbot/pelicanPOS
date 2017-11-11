import { OrderItem } from '../classes/orderItem';
import { Order } from './../classes/order';
import { retry } from 'rxjs/operator/retry';
import { Item } from './../classes/Item';
import { Injectable } from '@angular/core';
import { Basket } from '../classes/basket';
import { PayMethod } from '../classes/paymethod';
import { Transaction } from 'classes/transaction';


@Injectable()
export class TransactionManager{

    _currentOrderIndex = -1;
    orders: any[] = [];
    orderStatus:any = {items:0, message:"No Sale"};

    constructor(){
        this.getSaleStatus().then(stat=>{
            this.orderStatus = stat;
        });

    }//this.loadItems();

    private createOrder(){
        try{
            //create a new order
            console.log(">> TransManager.createOrder()");
            console.log(">> TransManager.createOrder()>> current length is: "+ JSON.stringify(this.orders));
            let o = new Order();
            let len = this.orders.push(o);
            console.log(">> TransManager.createOrder()>len is: "+len);
            this._currentOrderIndex = (len -1);
            console.log(">> TransManager.createOrder()>index is: "+ this._currentOrderIndex);
        }catch(ex){
            console.log(">> TransManager.createOrder() ERROR ADDING TO ORDER: "+ ex);
            
        }

    }

     addToOrder(item:Item){

        console.log(">>> transManager.addToOrder(item): "+JSON.stringify(item));
         //if there is no current order create one
         if(this._currentOrderIndex == -1){
            console.log(">>> transManager.addToOrder(item) >> Have to create order: ");
            //create a new order
            this.createOrder();
            console.log(">>> transManager.addToOrder(item) >> Order Created: ");
        }
        console.log(">>> transManager.addToOrder(item) >> About to add to CurrentOrder with index of : "+JSON.stringify(this.currentOrder()));
        this.currentOrder().addItem(item);
        this.getSaleStatus();
        console.log(">> transManager.addToOrder(item) getSalesStatus is: "+JSON.stringify(this.getSaleStatus()));

     }

     currentOrder():Order{
         //console.log(">>> Transmanager.currentOrder().this._currentOrderIndex: "+ this._currentOrderIndex)
         let val:Order = this.orders[this._currentOrderIndex];
          return val;   
     }
     

     getSaleStatus():Promise<any>{
         console.log(">>> TransManager.getSalesStatus()");
        return new Promise((respond, reject)=>{
            console.log(">>> TransManager.getSalesStatus() in promise");
            
            try{
                this.orderStatus = {items:0, message:"No Sale"}; 
                console.log(">>> TransManager.getSalesStatus() in try"+JSON.stringify(this.orderStatus));
                console.log(">>> TransManager.getSalesStatus() this._currentOrderIndex: "+this._currentOrderIndex);
                
                //if there is no current order
                if(this._currentOrderIndex == -1){
                    console.log(">>> TransManager.getSalesStatus() => there is no current order");
                    this.orderStatus =  {items:0, message:"No Sale"};
                }
                else{
                    console.log(">>> TransManager.getSalesStatus() => counting");
                    let count = this.currentOrder().currentBasket().orderItems.length;
                    let message = "Current Sale";
                    this.orderStatus = {"items":count, "message":message};
                }
                console.log(">>> TransManager.getSalesStatus() => res: "+JSON.stringify(this.orderStatus));
                respond(this.orderStatus);
    
            }catch(ex){
                console.log(">>> TransManager.getSalesStatus() => error: "+ex);
                reject(ex);
            }
            

        });
    }

    get_OrderItem_Total(orderItem:OrderItem):number{
                    try{
                        let price:number = 0;
                        if(!orderItem.value || !orderItem.quantity){
                            console.log(">> OrderItem ("+orderItem.title+") has no value");
                            return price;
                        }
                        console.log(">> OrderItem.total() started");
                        price = (orderItem.quantity * orderItem.value);
                        console.log(">> OrderItem ("+orderItem.title+").total() = qty: "+ orderItem.quantity+" + value: "+ orderItem.value + "= "+price);
                        return price;
                    }
                    catch(ex){
                        console.log(">> transManager.get_OrderItem_Total() ERROR: " + ex);
                    }
            }

        get_ItemTotal(item:Item):number{
            return 0;
        }

        removeItem(item:Item, basket?:Basket):Promise<boolean>{
            return new Promise<boolean>((resolve,reject)=>{
                let b:Basket = basket;
                try{
                    
                    if(!b){
                        b = this.currentOrder().currentBasket();
                    }
                    let index = b.orderItems.indexOf(item);
                    b.orderItems.splice(index,1);
                    console.log(">>> SUCCESS: TransactionManager.removeItem(item:'"+ JSON.stringify(item)+") from: "+JSON.stringify(b));
                    resolve(true);
                }catch(ex){
                    console.log("*** ERROR in TransactionManager.removeItem(item:'"+ JSON.stringify(item)+"):  from: "+JSON.stringify(b)+"with message: "+ ex);
                    reject(ex);
                }

            });
        }


    /******************************************************************************** 
    //PAYMENT METHODS
    *******************************************************************************/

    get_PayMethods():PayMethod[] {
        let paymethods:PayMethod[] = [];

        let pm1 = new PayMethod();
        pm1.icon="cash";
        pm1.name="Cash";

        let pm2 = new PayMethod();
        pm2.icon="card";
        pm2.name="Credit Card";

        let pm3 = new PayMethod();
        pm3.icon="list";
        pm3.name="FASTPass";

        paymethods.push(pm1);
        paymethods.push(pm2);
        paymethods.push(pm3);
        return paymethods;
    }

    tender():Promise<Transaction>{
        return new Promise<Transaction>((response, reject)=>{
            try{
                response();
            }catch(ex){
                reject(ex);
            }
        });
    }
        

}

