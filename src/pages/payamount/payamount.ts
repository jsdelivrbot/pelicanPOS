import { DetailPage } from '../detail/detail';
import { TransactionManager } from './../../providers/TransactionManager';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PayMethod } from '../../classes/paymethod';
import { Transaction } from '../../classes/transaction';
import { swipeShouldReset } from 'ionic-angular/util/util';
import { ConfirmPayPage } from '../../pages/confirmpay/confirmpay';


@Component({
  selector: 'page-payamount',
  templateUrl: 'payamount.html'
})

export class PayAmountPage {

  total:number = 0.00;
  item:PayMethod ;
  transObj:Transaction;


  constructor( public navCtrl: NavController, public  navParams: NavParams, public transManager:TransactionManager)  {
    this.loadData();
  }


    loadData(){
      this.item = this.navParams.get('paymethod');
      this.total= this.navParams.get('total');
      console.log(">> PayAmountPage.loadGetData(): Total: "+this.total);
    }

    ionViewDidEnter() {
      console.log(">> PayAmountPage.ionViewDidEnter called");
      this.loadData();
  }

  tender(){
    this.transManager.tender().then(o=>{
      //transaction attempt was successful now check if the paymentw as accespted or rejected
      this.transObj = o;

      //determine if the purchase has been made and is a success
      if( 200 >= o.statusCode  && o.statusCode<= 299){
        this.navPush('payConfirm');
      }

    }).catch;
  }

  navPush(str:string){
    switch(str.toLocaleLowerCase().trim()){
      case "payConfirm":
        this.navCtrl.push(ConfirmPayPage,{"transaction":this.transObj});
      break;
    }
  }
}
