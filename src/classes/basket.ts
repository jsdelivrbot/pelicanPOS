import { UUID } from 'angular2-uuid';
import { Item } from './Item';


//Basket: a grouping of orderItems within a single order.
export class Basket{

    _id:string =UUID.UUID();
    _rev:string;
    order_Id:string; // order for which this basket belongs
    orderItems: Item[] = []; //items in this order
    


    constructor(){}

    total():Promise<number>{
        return new Promise((respond,reject) =>{
            try{
                console.log(">> Order.Basket.total() ************ All items ********************* ");
                console.log(">> Order.Basket.total() Items: "+JSON.stringify(this.orderItems));
                console.log(">> Order.Basket.total() ************ END All items ********************* ");
                let ttl = 0;
                this.orderItems.forEach(o=>{
                   console.log(">> Order.Basket.total() Item: "+JSON.stringify(o)+" prev total is: "+ ttl);
                   ttl += o.value;
                   console.log(">> Order.Basket.total() After Item: "+ ttl);
                });
                respond(ttl);
    
            }catch(ex){
                reject(ex);
            }
        });
 
    }

    addItem(item:Item){
        console.log(" ");
        console.log("basket.addItem(item): Just added Item: "+JSON.stringify(item));
        console.log(" ");
        this.orderItems.push(item);
    }
}