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

  total:number = 0.00;
  item:PayMethod ;


  constructor( public navCtrl: NavController, public  navParams: NavParams, public transManager:TransactionManager)  {
    this.loadGetData();
  }


    loadGetData(){
      this.item = this.navParams.get('paymethod');
      this.total= this.navParams.get('total');
      console.log(">> PayAmountPage.loadGetData(): Total: "+this.total);
    }

    ionViewDidEnter() {
      console.log(">> PayAmountPage.ionViewDidEnter called");
      this.loadGetData();
  }
}
