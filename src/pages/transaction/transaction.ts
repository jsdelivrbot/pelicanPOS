import { Injectable, Component } from "@angular/core";
import { Transaction } from "../../classes/transaction";
import { TransactionManager } from "../../providers/TransactionManager";

@Component({
    selector:'page-transaction',
    templateUrl:'transaction.html'
})
  
export class TransactionPage{
    transactions:Transaction[] = [];

    constructor(public transManager:TransactionManager){
        transManager.getTransactions().then(o=>{
            this.transactions = o;
        }).catch(err=>{
            alert("Error getting transactions: "+JSON.stringify(err));
        });
    }
}