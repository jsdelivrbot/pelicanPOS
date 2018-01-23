import { Injectable, transition } from "@angular/core";
import { BarcodeScanResult } from "@ionic-native/barcode-scanner";
import { DateTime } from "ionic-angular/components/datetime/datetime";
import { parseDate } from "ionic-angular/util/datetime-util";



@Injectable()
export class UserData{

    private _isValid = false;  //determine if this is a valid USERDATA Card

    sentinals:String[] = []; //two centenals in the first and last characters of the string
    appCode:string = ""; //the code of the registered app that is sending the request, may affect where data is routed.
    openDate:any;
    subject:string = "";  // the id of the authorizing account
    availablebalance:number =0; //the last known balance on the account
    balCurrency:string; //the currency of the value 
    credit:number=0;  //the amount of credit overage allowed.
    credCurrency:string; //the currency of the value 
    uses:number=0; //the number of uses without requirign authentication


 
    constructor(result?:BarcodeScanResult){
           if(result){
               this.init(result);
           } 
    }


    init(result:BarcodeScanResult){
    //ps01-1121170346-8696626032-50000XCD-25000XCD-02p
    try{
        let Pos:number[] = [];
        Pos["s1"] =0;
        Pos["date"]=1;
        Pos["subject"]=2;
        Pos["balance"]=3
        Pos["credit"]=4;
        Pos["uses"]=5;
        Pos["s2"]=6;
    
        this.sentinals = []; //two centenals in the first and last characters of the string
        this.appCode = ""; //the code of the registered app that is sending the request, may affect where data is routed.
        this.openDate;
        this.subject = "";  // the id of the authorizing account
        this.availablebalance =0; //the last known balance on the account
        this.balCurrency; //the currency of the value 
        this.credit=0;  //the amount of credit overage allowed.
        this.credCurrency; //the currency of the value 
        this.uses=0; //the number of uses without requirign authentication
    
        let str = result.text; //EncryptionService.decrytStringdecrypt string here
        let parts = str.split("-");
    
        //extract leading sentinal
        let s1 = parts[Pos["s1"]].substr(0,2)
        this.sentinals.push(s1);
    
        //extract appcode from remainder of first part
        this.appCode = parts[Pos["s1"]].substr(2,parts[0].length-1);
        

        //regen dateTime form string
        let mm = parts[Pos["date"]].substr(0,2);
        let dd = parts[Pos["date"]].substr(2,2);
        let yy = parts[Pos["date"]].substr(4,2);
        let HH = parts[Pos["date"]].substr(6,2);
        let MM = parts[Pos["date"]].substr(8,2);
        let SS = parts[Pos["date"]].substr(10,2);
        let strDate = yy+"-"+mm+"-"+dd+"T"+HH+":"+MM+":"+SS+"Z";
        this.openDate = new Date(strDate);

        this.subject = parts[Pos["subject"]];
        
        this.availablebalance = parseInt(parts[Pos["balance"]]);
        let balLen = (this.availablebalance.toString().length);
    
        this.balCurrency = parts[Pos["balance"]].substr(balLen,parts[Pos["balance"]].length-1);
    
    
        let s2 = parts[parts.length-1].substr(length-2,2); //get the last item
        this.sentinals.push(s2) ; //centenal1, always the first two characters
    
        this.credit = parseInt(parts[Pos["credit"]]);
        this.credCurrency = parts[Pos["credit"]].substr(balLen,parts[Pos["credit"]].length-1);
    
        this.uses = parseInt(parts[Pos["uses"]]);

        this._isValid = true;
    
        }catch(ex){
            this._isValid = false;
        }
    }       
}