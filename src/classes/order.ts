import { isNumeric } from 'rxjs/util/isNumeric';
import { OrderItem } from './orderItem';
import { UUID } from 'angular2-uuid';
import { Basket } from './basket';
import { Item } from './Item';
import { retry } from 'rxjs/operator/retry';


//Basket: a grouping of orderItems within a single order.
export class Order{

    _id:string = UUID.UUID(); // order for which this basket belongs
    _rev:string;
    baskets: Basket[] = []; //groups of items in this order
    currentBasketIndex:number = -1; //The index of the currently active basket
    


    constructor(){
        this.createBasket();
    }

    createBasket(){
        let b = new Basket();
        b.order_Id = this._id;
        this.currentBasketIndex = this.baskets.push(new Basket())-1;
    }


    
    total():Promise<number>{
        return new Promise((respond,reject) =>{
            let ttl = 0;
            try{
                //for each basket
                this.baskets.forEach(o=>{
                    //subscribe to total
                   o.total().then(amt=>{
                    //console.log(">> Order.total() PrevBalance: "+ttl+" this basket: "+ amt);
                    ttl += amt;
                    //console.log(">> Order.total() Total at end of basket: "+ ttl);
                }).catch(ex=>{
                        //console.log("Order Total Exception getting total from basket"+ JSON.stringify(o));
                        //console.log("Order Total Exception: "+ JSON.stringify(ex));
                        reject(ex);
                    }).then(()=>{
                        //console.log(">> Order.total() GrandTotal: "+ ttl);
                        respond(ttl);
        
                    }) ;
                }) ;
    
            }catch(ex){
                //console.log(">> Order.total() GrandTotal ERROR: "+ ex);
                reject(ex);
            }
        });
 
    }




    getOrderItemsByBasketQty(showBasket:boolean):Promise<OrderItem[]>{
        return new Promise((respond,reject) =>{
            try{
                let myOrderItem:OrderItem;
                let collection:OrderItem[] = [];
                let h :boolean[] = [];

                let headerItem = new OrderItem();
                headerItem.title="";
                headerItem.icon="";
                headerItem.type="divider";
                

                this.baskets.forEach(b=>{
                    //console.log(">> Order.getOrderItems().foreach basket: "+JSON.stringify(b));
                    
                    //if showBasket add a divider item && group items within the basket
                    if(showBasket && (!h[b._id])){
                        //console.log(">> Order.getOrderItems().setting basket header: ");
                        
                        //add the basket divider
                        headerItem.title = "Order: "+ h.length;
                        h[b._id] = true;
                        
                        collection.push(headerItem)
                        //console.log(">> Order.getOrderItems() b.orderItems: "+JSON.stringify(b.orderItems));
                        
                        let tmpItems:Item[] = Object.assign([],b.orderItems);
                        

                        let completedItems:Item[] = [];
                        //foreach Item in the basket
                        let i = 0;
                        let max =  tmpItems.length-1;
                        while( i <= max ){
                            let item = tmpItems[i];
                            console.log(">>>> getOrderItemsByBasketQty() @ iteration: "+i);

                            //if this item in the loop has been found already
                            //remove this item from tmpItems and move on.
                            let thisIndex = completedItems.indexOf(item);
                            console.log(">>>> getOrderItemsByBasketQty() @ iteration: "+i+" (is item: "+JSON.stringify(item)+" is Already added to collection ?) this.index = "+thisIndex);
                            
                            if( thisIndex > -1){
                                console.log("     >>>>  getOrderItemsByBasketQty() @ iteration: "+i+" YES (item: "+JSON.stringify(item._id)+" already added to collection) this.index = "+thisIndex);
                                tmpItems.splice(thisIndex,1);
                                console.log("     >>>>  getOrderItemsByBasketQty() tmpItems is now : "+ tmpItems.length);
                                console.log("     >>>>  getOrderItemsByBasketQty() @ iteration: "+i );
                                
                            }
                            else{
                            console.log("     >>>>  getOrderItemsByBasketQty() @ iteration: "+i+" NO (item: "+JSON.stringify(item._id)+" is to be processed for collection now) this.index = "+thisIndex);
                            
                            let items:Item[] = []; // collection of used items

                            //get all instances of this item/price from b
                            let allOfThisItem:Item[] = tmpItems.filter((oi)=>{                            
                                //console.log(">> Order.getOrderItems().filtering(): "+JSON.stringify(oi));
                                //console.log(">> Order.getOrderItems().filtering() return: "+(oi._id == item._id && oi.value == item.value));
                                return (oi._id == item._id && oi.value == item.value);
                            });

                            //reduce allOfThisItem
                            let myOrderItem:OrderItem = new OrderItem();
                            if(allOfThisItem.length != 0){
 
                        
                                myOrderItem = allOfThisItem[0] as OrderItem;
                                //console.log(">> order.getOrderItems() >>getting qty ofJSON.stringify(tmpItems) OrderItem : " + JSON.stringify(myOrderItem));
                                
                                myOrderItem.quantity = allOfThisItem.length;
                                //console.log(">> order.getOrderItems() >> qty (count value of an item): " + myOrderItem.quantity);
                                
                                collection.push(myOrderItem);
                                completedItems.push(myOrderItem);


                                //find each instance of this item and remove it from tmpItems
                                let a=0;
                                let aIndex=0;
                                for(a=1; a< allOfThisItem.length; a++){
                                    let aIndex = tmpItems.indexOf(item);
                                    tmpItems.splice(aIndex,1);
                                    console.log(">> duplicate "+item._id+" removed from "+aIndex + " in loop "+a );
                                }
                                max = tmpItems.length-1;
                                console.log(">> max is now "+max+" removed from "+aIndex + " in loop "+a );
                                
                            }
                        }
                        i++;

                            //console.log(">> order.getOrderItems() >> The new tmpItems Number of Items: " + JSON.stringify(tmpItems.length));
                            //console.log(">> order.getOrderItems() >> The new tmpItems : " + JSON.stringify(tmpItems));
                        } //end of while loop   

                    }
    
                });
                respond(collection);
    
            }catch(ex){
                reject(ex);
            }
        });
 
    }

    addItem(item:Item){
        if(this.currentBasketIndex == -1){
            //console.log(">> Order.addItem(item) about to create baseket");
            this.createBasket();
            //console.log(">> Order.addItem(item) baseket created");
        }
        //console.log(">> Order.addItem(item) about to add Item to basket with index of:  "+ this.currentBasketIndex);
        this.currentBasket().addItem(item);
    }

    currentBasket(){
        return this.baskets[this.currentBasketIndex];
    }
}