import { DateTime } from "ionic-angular/components/datetime/datetime";
import { Order } from "../classes/order";


//The Transaction Object stores data to be parsed to and from Transaction Related Activities
export class Transaction{
    _id:string
    _Rev:string;

    to:string;  //user.to._id;
    subject:string; //fromUser
    amount:number; //amount of transaction
    currency:string; //XCD;
    type:string = "memberaccount.userpayment";
    date:string;
    description:string;
    status:string;
    statusCode:number;
    order:Order;


/*
        //request variables
        var fromUser = "'" + data.subject;
        var toUser = "'" + data.to._id; //"mrkencable@gmail.com";
        var type = data.type; //"memberaccount.userpayment"; // function constant
        var scheduling = data.scheduling; // "direct";
        var amount = data.amount;
        var description = data.description; // "something";
        var currency = data.currency; //"XCD"
*/

    constructor(){}
}