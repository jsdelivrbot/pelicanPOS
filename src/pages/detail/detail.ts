import { Item } from './../../classes/Item';
import { OrderItem } from './../../classes/orderItem';
import { KeypadPage } from '../keypad/keypad';
import { Component} from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import {TransactionManager} from '../../providers/TransactionManager';
import { Toast } from 'ionic-angular/components/toast/toast';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { fakeAsync } from '@angular/core/testing';
import { ViewChild } from '@angular/core';
import { Button } from 'ionic-angular/components/button/button';




@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html'
})

export class DetailPage {

    @ViewChild('btnDel') btnDel:Button;
    orig:OrderItem;
    item:OrderItem;
    total:number;
    changeVal:number = 0;  //stores the quantity changes to apply onSave();
    isRemoveConfirmed:boolean = false;
    removeButtonText:string = "Remove";



    constructor(public events:Events, private toastCtrl:ToastController ,public navParams:NavParams, public transManager:TransactionManager, public navCtrl: NavController) {
        this.orig = this.navParams.get("orderItem");
        
        if(!this.orig){
            navCtrl.pop();
        }
        this.item = Object.assign({},this.orig);
        
        this.total = this.transManager.get_OrderItem_Total(this.item);
        this.changeVal = this.item.quantity;

        console.log("Total is: "+this.total);
}

    getPrice():number{
        return this.item.value;
    }

    add(){
        //this.transManager.addToOrder(this.item);
        this.changeVal++;
    }

    sub(){
        //this.transManager.removeItem(this.item);
        if(this.changeVal != 0){
            this.changeVal--;
        }
        

    }

    navPush(key:string){
        switch(key.toLowerCase()){
            case "keypad":

            this.navCtrl.push(KeypadPage
                ,{"item":this.item,
                callback:this.myCallbackFunction});            
        }
    }

    // callback...
    myCallbackFunction = function(_params) {
        return new Promise((resolve, reject) => {
            console.log("callback return with value: "+JSON.stringify(_params));
            this.item.value = _params;
                resolve();
            });
    }  
    
    showObj():string{
        return JSON.stringify(this.item);
    }

    save(){
        console.log("SAVING TO: "+JSON.stringify(this.transManager.currentOrder().currentBasket().orderItems));
        let increments = Math.abs(this.changeVal - this.item.quantity);
        let newItem:Item = Object.assign({},this.item) as Item; //copy array not reference.
        console.log("about to add item: "+JSON.stringify(newItem) + "to list:");
        console.log("List: "+JSON.stringify(this.transManager.currentOrder().currentBasket().orderItems) + "to list:");
        
        console.log("increments is: Math.abs(this.changeVal (" + this.changeVal +") - this.item.value ("+this.item.quantity+") = "+increments);
        for(let i=0; i<increments; i++){
            if(this.changeVal < this.item.quantity){
                this.transManager.removeItem(newItem);
                console.log("removing item");
            }
            else{
                console.log("adding item");
                this.transManager.addToOrder(newItem);
            }
        }
        Object.assign(this.orig,this.item);
        this.navCtrl.pop();
    }


    remove(){

        if(this.isRemoveConfirmed){
        let delToast = this.toastCtrl.create({
            message:'',
            duration:2000,
            position:'top'
        });
    
        this.transManager.removeItem(this.item).then(o=>{
            delToast.setMessage(" Item removed from order");
        }).catch(ex=>{
            delToast.setMessage(ex);
        });
        this.isRemoveConfirmed = false;
        this.btnDel.color = "default";
        this.removeButtonText = "remove";
        this.navCtrl.pop();
        
    }
    else{
        this.isRemoveConfirmed = true;
        this.btnDel.color = "danger";
        this.removeButtonText = "Confirm";
    }

    }
}
        