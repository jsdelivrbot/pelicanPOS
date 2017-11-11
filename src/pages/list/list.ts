import { DetailPage } from '../detail/detail';
import { HomePage } from '../home/home';
import { OrderItem } from './../../classes/orderItem';
import { TransactionManager } from './../../providers/TransactionManager';
import { InventoryManager } from '../../providers/InventoryManager';
import { Item } from './../../classes/Item';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';


@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})

export class ListPage {
  selectedItem: any;
  icons: string[];
  items: OrderItem[] = [];  //Array<{title: string, note: string, icon: string}>;
  total:number = 0.00;


  constructor( public navCtrl: NavController, public  navParams: NavParams, public transManager:TransactionManager)  {

    }


    ionViewDidEnter() {
      console.log(">> ListPage.ionViewDidEnter called");
      this.loadGetData();
  }


  loadGetData(){
    this.transManager.currentOrder().getOrderItemsByBasketQty(true).then(res=>{
      this.items = res;

      console.log(">> ListPage.constructor().allitems>"+JSON.stringify(this.items));
      
      this.transManager.currentOrder().total().then(o=>{
        this.total = o
      });

      this.items.forEach(item=>{
        try{
          console.log(">> ListPage.constructor().items>"+item.title);
          let p:number = this.transManager.get_OrderItem_Total(item);
          console.log("   >> ListPage.constructor().item.get_total(): "+ (item.value * item.quantity)+" or from function: " + p);
        }
        catch(ex){
          console.log("   ***  ListPage.constructor().item.get_total() Error at get_total(): '"+ex+"'");
          }
        });
      });


  }
    getTotal(orderItem:OrderItem):number{
      
      let p:number = this.transManager.get_OrderItem_Total(orderItem);
      return p;
    }

  itemTapped(event, item) {

    this.navCtrl.push(DetailPage,{"orderItem":item});
    // That's right, we're pushing to ourselves!
    //this.navCtrl.push(ListPage, {
      //item: item
    //});
  }
}
