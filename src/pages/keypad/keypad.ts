import { OrderItem } from './../../classes/orderItem';
import { HomePage } from './../home/home';
import { TransactionManager } from './../../providers/TransactionManager';
import { Component } from '@angular/core';
import { NavController, NavOptions, NavParams, Events } from 'ionic-angular';
import { InventoryManager } from './../../providers/InventoryManager';
import { Item } from './../../classes/Item';

@Component({
  selector: 'page-keypad',
  templateUrl: 'keypad.html'
})

export class KeypadPage {

    amt =0.00; //amount
    strAmt ="0";
    item:OrderItem;
    callback:any; // used to parse value back to calling page
    isEdit = false;

   constructor(public events:Events, public navCtrl:NavController ,public navParams:NavParams, private invManager:InventoryManager, private transManager:TransactionManager){

    //if editing an existing OrderItem
       if(navParams.get("item")){
           this.item = navParams.get("item");
            this.amt = this.item.value;
            this.isEdit = true;
       }
   }

   zeroOut(){
    this.amt = 0.00;
    this.strAmt ="0";
   }
    onkeyPress(val:String){
       console.log("button pressed: "+ val +" value before is: "+this.amt.toString());
       switch(val.toLowerCase()){
           case "c": //clear 
               this.zeroOut();
           break;

           case "+":  //add amount item to order
                try{
                    console.log("+ button pressed");    
                    //not creating a new item, modifying price on existing
                    if(this.isEdit){
                        console.log("+ and item was found: "+JSON.stringify(this.item));    
                        this.callback = this.navParams.get("callback");
                        //console.log("+ this.callback is: "+JSON.stringify(this.callback));    
                        
                        this.callback(this.amt);
                        
                        console.log("+ this.callback then now running: ");    
                        this.navCtrl.pop();
                         return; 
                    }
                    else{
                        let item = new Item();
                        item.value = this.amt;
                        item.title="Custom Amount";
                        item.type="manual";
                        item.icon="navy";
                        console.log(">>> Keypad.onKeyPress(+) - about to add '"+JSON.stringify(item)+"'" );
                        this.transManager.addToOrder(item);
                        console.log(">>> Keypad.onKeyPress(+) - about to ZeroOut '");
                        this.events.publish('functionCall:itemAdded', {"caller":"keypadInput", "offsetLeft":191});
                        this.zeroOut();
                        console.log("keypad >> Item Added: "+JSON.stringify(item));  
                    }  

                }catch(ex){
                    console.log("keypad >> Error adding item: "+JSON.stringify(ex));
                
                }
           break;

           default: //concat digit to back of total.
                // if this.Amt is zero the concat value on end and fix to two decimal places

                //conver existing number to string, removing all text characters
                this.strAmt = this.strAmt.replace(".","").replace(",","") + val;
                console.log("strAmt is: "+ this.strAmt);

                //concat new digit to back of existing number and devide by 100 to get cents value
                let numAmt = (parseInt(this.strAmt)/100);
                console.log("numAmt is: "+this.strAmt);
                
                //set digit value as amount
                this.amt = numAmt;
           break;
       }
       console.log("value after : "+ val +" is: "+this.amt.toString());
       
    }
}