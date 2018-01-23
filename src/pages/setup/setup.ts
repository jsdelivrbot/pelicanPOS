import { Injectable, Component } from "@angular/core";
import { UniqueDeviceID } from "@ionic-native/unique-device-id";
import { ViewChild } from "@angular/core"
import { Slides, Button } from "ionic-angular";
import { Merchant } from "../../classes/merchant";
import { User } from "../../classes/User";
import { Operator } from "../../classes/operator";


@Component({
    selector: 'page-setup',
    templateUrl: 'setup.html'
})

export class SetupPage{

    merchant:Merchant
    currentStep:number = 0;
    terminalId:string ="";
    @ViewChild("btnPrev") btnPrev:Button;
    @ViewChild("btnNext") btnNext:Button;
    @ViewChild("slides") slides:Slides;

    constructor(private uniqueDeviceID: UniqueDeviceID){

            //get the uuid of the device, or make a randome one if not found
            uniqueDeviceID.get().then(o=>{this.terminalId = o;}).catch(err=>{
                console.log("error getting real UUID... generating my own and storing locally ... error was: "+JSON.stringify(err));
                this.terminalId = this.uuidv4();
                console.log("this terminal will hae UUID of : "+ this.terminalId);
            });

            let o:Operator = new Operator();
            o.isAdmin = true;
            this.merchant.operators.push(o);
            
    }


    slideChanged(){
       this.currentStep = this.slides.getActiveIndex();
    }

    btnPress(s:string){
        console.log("Click detected: '"+s+"'");
        console.log("Step before change is: '"+this.currentStep+"' of: '"+(this.slides.length()-1)+"'");
        console.log("N: '"+this.currentStep+"'");
        switch(s){
            case "next":
                if( (this.currentStep < this.slides.length()-1)){
                    this.slides.slideNext()
                }
                
            break;

            case "prev":
                if(this.currentStep > 0 ){
                    this.slides.slidePrev();
                }
            break;


        }
    }

    setStage(){
        if(this.currentStep == 0){
            this.btnPrev.setElementStyle("display","none");
        }
    }






    uuidv4():string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      }
      
}