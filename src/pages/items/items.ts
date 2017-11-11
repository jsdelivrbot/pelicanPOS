import { TransactionManager } from './../../providers/TransactionManager';

import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { InventoryManager } from './../../providers/InventoryManager';
import { Item } from './../../classes/Item';

@Component({
  selector: 'page-items',
  templateUrl: 'items.html'
})

export class ItemsPage {
  
  items: Item[] = [];
  searchTerm:String ="";

  constructor(public events:Events, public navCtrl: NavController, public navParams: NavParams,  private invManager: InventoryManager, public transManager:TransactionManager) {
    
    console.log(">>> items.ts >> constructor called");
    
    //get all items from inventory.
    this.invManager.getItems().then(response=>{
      console.log(">>> this._items @ subscribe is: "+ JSON.stringify(response));
      this.items = response;
      console.log(">>>> Success getting items: "+JSON.stringify(this.items));
    }).catch(ex=>{
      console.log(">>>> Error getting items: "+JSON.stringify(ex));
    });
  }

  addItem(){
    let itemNo:number = this.invManager.NoOfItems() + 1;
    let i = this.invManager.setItem(itemNo.toString()
    , ""
    ,"product"
    ,"darkgrey"
    ,"Product "+ itemNo
    ,"Products"
    ,["product",itemNo.toString(),"product "+itemNo.toString
    ],[],[],itemNo*100);

    this.invManager.addItem(i);
    this.searchTerm = "";
    this.setFilteredItems();
  };


  //button clicked
  itemTapped(event, item) {

    this.transManager.addToOrder(item);
    this.events.publish('functionCall:itemAdded', {"caller": item._id});
  }

  //filter items
  setFilteredItems(){
    this.items = this.invManager.filterItems(this.searchTerm);
  }
}
