import { ListPage } from './../list/list';
import { ItemsPage } from './../items/items';
import { KeypadPage } from '../keypad/keypad';
import {PayMethodPage} from '../paymethod/paymethod';
import { Component, Renderer2, ElementRef } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { TransactionManager } from './../../providers/TransactionManager';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  
  saleStatus:any;
  keypad:any = KeypadPage;
  items:any = ItemsPage;
  total:number = 0.00;

  constructor(public events:Events, public navCtrl: NavController, private transManager:TransactionManager, private renderer:Renderer2, private El:ElementRef) {
    this.events.subscribe('functionCall:itemAdded', data=>{
      console.log(">>home.constructor()... subscribed to event with data: "+data.caller);
      this.transManager.currentOrder().total().then(o=>{
        this.total = o
      });
      
      this.moveToCart(data.caller,data);
    });

  }

  public moveToCart(ref,data){
    
        //create the "Shadow div to move";

        const div = document.getElementById("checkoutDiv");// this.renderer.createElement('div');
        let item = document.getElementById(ref);

        //remove any previous moveToCart Class
        this.renderer.removeClass(div,"moveToCart");
        

        var rect = item.getBoundingClientRect();
        console.log(rect.top, rect.right, rect.bottom, rect.left);
        //set position to the starting position
        console.log(">>> moveToCart() >> rect.top: "+rect.left+" offsetLeft: "+ (data.offsetLeft ? data.offsetLeft:0) +" total left is: "+ (rect.left + (data.offsetLeft ? data.offsetLeft:0)) +"px");
        div.style.top =  (rect.top + (data.offsetTop ? data.offsetTop:0)) + "px";
        div.style.right = (rect.right + (data.offsetRight ? data.offsetRight:0)) +"px";
        div.style.bottom = (rect.bottom + (data.offsetBottom ? data.offsetBottom:0)) +"px";
        div.style.left = (rect.left + (data.offsetLeft ? data.offsetLeft:0)) +"px";
        
        this.renderer.setStyle(div,"background-color","red");

        //apply the class to move
        this.renderer.addClass(div,"moveToCart");
        
      }

      private cumulativeOffset(element):any {
        var top = 0, left = 0;
        do {
            top += element.offsetTop  || 0;
            left += element.offsetLeft || 0;
            element = element.offsetParent;
        } while(element);
    
        return {
            top: top,
            left: left
        };
    };

    pushNav(val:string){
      
      console.log(">>> Home.pushNav("+val+")");
      switch(val.toLowerCase()){
        case 'list':
          console.log("HomePage.pushNav(): ListPage is called with:"+val);
          this.navCtrl.push(ListPage);
          break;

        case 'payment':
        console.log("HomePage.pushNav(): paymethodPage is called with:"+val);
        this.navCtrl.push(PayMethodPage,{"total":this.total});
        break;
        
      }
    }

}
