import { Injectable, Component } from "@angular/core";
import { Transaction } from "../../classes/transaction";
import { TransactionManager } from "../../providers/TransactionManager";
import { DateTimeData, parseDate } from "ionic-angular/util/datetime-util";

@Component({
    selector:'page-transaction',
    templateUrl:'transaction.html'
})
  
export class TransactionPage{
    transactions:any = [];

    sortArgs:any = {sortBy:"id", sortOrder:-1, sortDataType:"Date"};

    constructor(public transManager:TransactionManager){
        this.transactions = transManager.data;
        //alert("transactions: "+JSON.stringify( this.transactions));

        /*
        transManager.getTransactions().then(o=>{
            this.transactions = o;
            console.log("this.transactions are: "+JSON.stringify(this.transactions));
        }).catch(err=>{
            alert("Error getting transactions: "+JSON.stringify(err));
        });
        */
    }

    testMe(val:any, count:number){
        console.log("dynamic row >>>>> "+ count+": "+ JSON.stringify(val))
    }


    dateToString(d:any):string{
        
        let date = this.getDate(d);
        //console.log(" >>>>>>>>> DateToString is: "+JSON.stringify(date));
        if(date != null || date != undefined){
            return date.year+"-"+date.month+"-"+date.day+" "+date.hour+":"+date.minute;
        }
        return "";
    }



    getDate(a:any):DateTimeData{
        //console.log(">>> getData(a): a is: "+JSON.stringify(a));
        let aParts:string[] = a.split("_");
        //console.log(">>> aParts.length: a is: "+JSON.stringify(aParts.length));

        let aStringpart = aParts[aParts.length-1];
        //console.log(">>> aStringpart: is: "+JSON.stringify(aStringpart));

        let aDate = parseDate(aStringpart);
        //console.log(">>> aDate: is: "+JSON.stringify(aDate));
        
        let aDateParts:string[] = aStringpart.split("@");
        //console.log(">>> aDateParts.length: "+JSON.stringify(aDateParts.length));
        
        let atime:string = aDateParts[1].substring(0,2) + ":"+aDateParts[1].substring(2,4) + ":"+aDateParts[1].substring(4,6);
        //console.log(">>> aDateParts.lengthatime: "+JSON.stringify(atime));
        

        let aString = aDateParts[0]+"T"+ atime+"Z";
        //console.log(">>> aString: "+JSON.stringify(aString));

        let aVal = parseDate(aString);
        //console.log(">>> aVal: "+ aVal);
      return aVal;
    }
}