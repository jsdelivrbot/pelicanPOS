import { DetailPage } from '../detail/detail';
import { TransactionManager } from './../../providers/TransactionManager';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PayMethod } from '../../classes/paymethod';


@Component({
  selector: 'page-confirmpay',
  templateUrl: 'confirmpay.html'
})

export class ConfirmPayPage {

  item:PayMethod ;
  itemstr:string;


  constructor( public navCtrl: NavController, public  navParams: NavParams)  {
    this.loadGetData();
  }


    loadGetData(){
      this.item = this.navParams.get('transactionStatus');
      console.log(">> ConfirmPay.loadGetData(): transactionStatus: "+this.item);
      this.itemstr = JSON.stringify(this.item);
    }

    ionViewDidEnter() {
      console.log(">> PayAmountPage.ionViewDidEnter called");
      this.loadGetData();
  }
}
