import { TransactionManager } from './../../providers/TransactionManager';

import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { InventoryManager } from './../../providers/InventoryManager';
import { Item } from './../../classes/Item';
import { swipeShouldReset } from 'ionic-angular/util/util';
import { ScanPage } from '../../pages/scan/scan';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { AlertController, AlertOptions } from 'ionic-angular';
import { CurrencyPipe } from '@angular/common';
import { toPublicName } from '@angular/compiler/src/i18n/serializers/xmb';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { ConfirmPayPage } from '../../pages/confirmpay/confirmpay';


@Component({
  selector: 'page-topup',
  templateUrl: 'topup.html'
})

export class TopupPage {

  status:string = "";
  isenabled = false;
  amount:number;
  userId:string ="";

  constructor(public events:Events, public barcodeScanner:BarcodeScanner, public navCtrl: NavController
    , public navParams: NavParams,  private invManager: InventoryManager, 
    public transManager:TransactionManager, public alertCtrl:AlertController, private currencyPipe: CurrencyPipe, public loadCtrl:LoadingController) {
        console.log(">>> items.ts >> constructor called");
  }

  onAmountInput(){
    console.log(">>>>> TopupPage.onAmountInput() amount: "+this.amount);
      this.isenabled = (this.amount && this.amount >= 1)?true:false;
      console.log(">>>>> TopupPage.onAmountInput() isenabled: "+this.isenabled);
    }

  onClick(action:string){
    console.log(">>>>> TopupPage.onClick("+ action +") clicked: ");
    switch(action.trim().toLowerCase()){

      case "scan":
        this.barcodeScanner.scan().then(o=>{
          let userId:string = o.text;
          if(userId){
            //this.transManager.set_Transaction(100,"XCD","topup",)
            this.transManager.topup(userId, this.amount).then(o=>{
              //topup successful
            }).catch(err=>{
              //topup error
            });
          }
        });
          this.navCtrl.push(ScanPage,{action:'topup'});
      break;

      case "manual":
        this.status = "manual";
        console.log(">>>>> TopupPage.onClick("+ action +") this.status: "+this.status);
        break;

        case "topup":
        let opts = {

        }
        let alert = this.alertCtrl.create({
    title: 'Final Confirmation',
    message: 'You are about to add: '+ this.currencyPipe.transform(this.amount,"USD",true,"1.2-2") + " <br> to account: " + this.userId,
    enableBackdropDismiss:false,
    buttons: [
      {
        text: 'EDIT',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      },
      {
        text: 'PROCEED',
        handler: () => {
          this.topup();
        }
      }
    ]
  });
  alert.present();

        console.log(">>>>> TopupPage.onClick("+ action +") this.status: "+this.status);
        break;
    }
  }

  topup(){
    console.log('Performing Topup process');
    let load = this.loadCtrl.create();
    load.present();

    this.transManager.topup(this.userId,this.amount).then(o=>{
      this.navCtrl.push(ConfirmPayPage,{"transactionStatus":o});  
    }).catch((err)=>{
      console.log("*****  TopupPage.topup(): Error topping up account: "+JSON.stringify(err));  
    });


    setTimeout(() => {
      load.dismiss();
    }, 5000);    
    
  }
}
