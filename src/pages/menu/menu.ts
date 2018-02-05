import { TransactionManager } from './../../providers/TransactionManager';

import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { InventoryManager } from './../../providers/InventoryManager';
import { Item } from './../../classes/Item';
import { HomePage } from "../home/home";
import { TopupPage } from '../topup/topup';
import { MerchantManager } from '../../providers/merchantManager';
import { Merchant } from '../../classes/merchant';
import { Operator, Permission } from '../../classes/operator';
import { UserManager } from '../../providers/userManager';
import { MenuItem } from '../../classes/menuItem';
import { TransactionPage } from '../../pages/transaction/transaction';

@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html'
})

export class MenuPage {
  
  items: Item[] = [];
  searchTerm:String ="";
  merchant:Merchant = null;
  operator:Operator = null;
  menuItems:MenuItem[] = [] 
  

  constructor(public events:Events, public navCtrl: NavController, public navParams: NavParams,
      private invManager: InventoryManager, public transManager:TransactionManager,
       private merchantManager:MerchantManager, private userManager:UserManager) {


        let m1 = new MenuItem();
        m1.program_id="program_001_cashregister";
        m1.displayName="Cash Register";
        m1.bgColor = "Primary";
        m1.icon="ios-cash-outline";
        m1.launch_app=HomePage;
        m1.position=0;

        let m2 = new MenuItem();
        m2.program_id="program_001_cashregister_v1";
        m2.displayName="Cash Register";
        m2.bgColor = "Primary";
        m2.icon="ios-cash-outline";
        m2.launch_app=HomePage;
        m2.position=0;

        let m3 = new MenuItem();
        m3.program_id="program_003_transactionmanager_v1";
        m3.displayName="My Transactions";
        m3.bgColor = "Primary";
        m3.icon="ios-cash-outline";
        m3.launch_app=TransactionPage;
        m3.position=0;

        this.menuItems.push(m1);
        this.menuItems.push(m2);
        this.menuItems.push(m3);


    

    console.log(">>> MenuPage.ts >> constructor called!");  
      this.merchant = merchantManager.get_CurrentMerchant();
      this.operator = userManager.get_currentUser();
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
      
      
      case '2':
      console.log("Here 3");
      this.navCtrl.push(TransactionPage);
      console.log("Here 4");
      break;

      
      case '3':
      console.log("Here 5");
      this.merchantManager.remove_localMerchants();
      this.merchantManager.set_CurrentMerchant(null);
      this.userManager.set_CurrentUser(null);
      this.navCtrl.popToRoot();
      console.log("Here 6");
      break;
      
    }
  }  
}
