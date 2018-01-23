import { TransactionManager } from './../../providers/TransactionManager';

import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { InventoryManager } from './../../providers/InventoryManager';
import { Item } from './../../classes/Item';
import { HomePage } from "../home/home";
import { TopupPage } from '../topup/topup';

@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html'
})

export class MenuPage {
  
  items: Item[] = [];
  searchTerm:String ="";

  constructor(public events:Events, public navCtrl: NavController, public navParams: NavParams,  private invManager: InventoryManager, public transManager:TransactionManager) {
    
    console.log(">>> MenuPage.ts >> constructor called");
  }
  menuItem(item:string){
    console.log("Here 1");
    switch(item.trim().toLowerCase()){
      case '0':
      console.log("Here 2");
      this.navCtrl.push(HomePage);
      break;
      
      case '1':
      console.log("Here 3");
      this.navCtrl.push(TopupPage);
      console.log("Here 4");
      break;
      
    }
  }  
}
