import { isNumeric } from 'rxjs/util/isNumeric';
import { OrderItem } from './orderItem';
import { UUID } from 'angular2-uuid';
import { Basket } from './basket';
import { Item } from './Item';
import { retry } from 'rxjs/operator/retry';
import { DatabaseProvider } from '../providers/databaseProvider';


//Basket: a grouping of orderItems within a single order.
export class Order{

    _id:string = "order_" + UUID.UUID(); // order for which this basket belongs
    _rev:string;
    baskets: Basket[] = []; //groups of items in this order
    currentBasketIndex:number = -1; //The index of the currently active basket
    currency:string ="XCD";
    isReadOnly:boolean = false;
    lockedBy:string = "";
    

    constructor(){
        this.createBasket();
    }

    LockedException = {
        "message":"Order is Locked by: "+this.lockedBy,
        "lockedby":this.lockedBy,
        "code":450
    };

    createBasket(){
        let b = new Basket();
        b.order_Id = this._id;
        this.currentBasketIndex = this.baskets.push(b)-1;
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
                        
                        //uncomment line below to add a header for each basket
                        //collection.push(headerItem)

                        //console.log(">> Order.getOrderItems() b.orderItems: "+JSON.stringify(b.orderItems));
                        
                        let tmpItems:Item[] = Object.assign([],b.orderItems);
                        //tmpItems.sort();

                        let completedItems:Item[] = [];
                        //foreach Item in the basket
                        let i = 0;
                        let max =  tmpItems.length-1;

                        //go through each item in tmpItems and add to collection if new or ignore if old
                        while( i <= max ){

                            //current Item in question is the index from 0 to max-1
                            let item = tmpItems[i];


                            //search for item in collection of completed items (>-1 if found)
                            let isUsedItem:Item[] = completedItems.filter((o)=>{
                                console.log(">>>> getOrderItemsByBasketQty() @ iteration: "+i+"    >>> CHECKING ( id and value of item: "+JSON.stringify(item) +" to: "+JSON.stringify(o));
                                return(item._id.toLowerCase().trim() == o._id.toLowerCase().trim() && item.value == o.value);
                            });

                                console.log(">>>> getOrderItemsByBasketQty() @ iteration: "+i+" (is item: "+JSON.stringify(item)+(isUsedItem.length >0? " has NOT been aggregated" : "has ALREADY been aggregated"));
                                console.log("---------------------------------------------------------------------------------------------------------------------------------");

                           //if this item has already been aggregated SKIP
                            if(isUsedItem.length > 0){
                                //do nothing and move on to the next iteration
                            }
                            else{
                            
                                //get all instances of this item
                                let items:Item[] = []; // collection of used items

                                //get all instances of this item/price from b
                                let allOfThisItem:Item[] = tmpItems.filter((oi)=>{                            
                                    //console.log(">> Order.getOrderItems().filtering(): "+JSON.stringify(oi));
                                    //console.log(">> Order.getOrderItems().filtering() return: "+(oi._id == item._id && oi.value == item.value));
                                    return (oi._id == item._id && oi.value == item.value);
                                });

                            //reduce allOfThisItem
                            let myOrderItem:OrderItem = new OrderItem();


                            // if there is at least one item in this array
                            if(allOfThisItem.length != 0){
 
                                //GET THE FIRST ITEM OF THIS DUPLICATE ARRAY
                                myOrderItem = allOfThisItem[0] as OrderItem;
                                //console.log(">> order.getOrderItems() >>getting qty ofJSON.stringify(tmpItems) OrderItem : " + JSON.stringify(myOrderItem));
                                
                                //set the quantity of this item to the count of allofthisItem array
                                myOrderItem.quantity = allOfThisItem.length;
                                //console.log(">> order.getOrderItems() >> qty (count value of an item): " + myOrderItem.quantity);
                                

                                //Add this new item to the display array (Collection)
                                collection.push(myOrderItem);

                                //Add this item to the completedItems (Array of already processed items)
                                completedItems.push(myOrderItem);


                            }
                        }

                        //processing of this item is completed, move on to the next item and repeat
                        i++;
                        } //end of while loop   
                    }
    
                });
                respond(collection); //return with the display collection only
    
            }catch(ex){
                reject(ex);
            }
        });
 
    }

    addItem(item:Item){
        if(this.isReadOnly){
            throw this.LockedException;
        }
        
        if(this.currentBasketIndex == -1){
            //console.log(">> Order.addItem(item) about to create baseket");
            this.createBasket();
            //console.log(">> Order.addItem(item) baseket created");
        }
        //console.log(">> Order.addItem(item) about to add Item to basket with index of:  "+ this.currentBasketIndex);
        this.currentBasket().addItem(item);


        //Save TO POS DATABASE
        let db:DatabaseProvider = new DatabaseProvider(); 
       //console.log(">>> order.addItem(item) item is: '"+JSON.stringify(item));
        
        //make the put call
        db.put(this._id,this).then(o=>{
           //console.log(">>> order.addItem(item) saved item is: '"+JSON.stringify(o));
            this._rev = o.rev;
        }).catch(ex=>{
           //console.log("***  order.addItem(item) error saving: '"+JSON.stringify(ex));
            
        });      
        
        
    }

    currentBasket(){
        return this.baskets[this.currentBasketIndex];
    }
}