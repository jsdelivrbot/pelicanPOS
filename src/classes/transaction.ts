import { DateTime } from "ionic-angular/components/datetime/datetime";
import { Order } from "../classes/order";


//The Transaction Object stores data to be parsed to and from Transaction Related Activities
export class Transaction{
    _id:string
    _Rev:string;

    to:string;
    from:string;
    amt:number;
    type:string;
    date:DateTime;
    description:string;
    status:string;
    statusCode:number;
    order:Order;

    constructor(){}
}