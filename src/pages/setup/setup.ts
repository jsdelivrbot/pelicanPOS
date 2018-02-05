import { Injectable, Component, AfterViewInit } from "@angular/core";
import { UniqueDeviceID } from "@ionic-native/unique-device-id";
import { ViewChild } from "@angular/core"
import { Slides, Button, LoadingController, AlertController, NavController } from "ionic-angular";
import { Merchant } from "../../classes/merchant";
import { User } from "../../classes/User";
import { Operator, Permission } from "../../classes/operator";
import { UserManager } from "../../providers/userManager";
import { MerchantManager } from "../../providers/merchantManager";
import { Terminal } from "../../classes/terminal";
import { MenuPage } from "../../pages/menu/menu";


@Component({
    selector: 'page-setup',
    templateUrl: 'setup.html'
})

export class SetupPage implements AfterViewInit{

    merchant:Merchant = new Merchant();
    currentStep:number = 0;
    terminalId:string ="";
    @ViewChild("btnPrev") btnPrev:Button;
    @ViewChild("btnNext") btnNext:Button;
    @ViewChild("slides") slides:Slides;
    myOperators:Operator[] = [];
    showMerchant:string="";
    systemPermissions:Permission[] = [];
    operatorPassword:any[] = [];
    btnNextText:string = "Next";
    btnBackText:string = "Back";
    currentIndex:number=0;

    ngAfterViewInit(){
        this.slides.lockSwipes(true);
    }
    constructor(private uniqueDeviceID: UniqueDeviceID, private userManager:UserManager,
         private merchantManager:MerchantManager, private loadingCtrl:LoadingController,
          private alertController:AlertController, private navCtrl:NavController){


        //get permission options from database
        
            this.showMerchant = JSON.stringify(this.merchant);
            //get the uuid of the device, or make a randome one if not found
            uniqueDeviceID.get().then(o=>{this.terminalId = o;}).catch(err=>{
                console.log("error getting real UUID... generating my own and storing locally ... error was: "+JSON.stringify(err));
                this.terminalId = this.uuidv4();
                console.log("this terminal will hae UUID of : "+ this.terminalId);
            });
            let o:Operator = this.addOperator();    
            o.isAdmin = true;
            console.log("there are: "+this.merchant.getOperators().length);    
            this.myOperators = this.merchant.getOperators();

            
    }

    setPin(){
        let operator:Operator = this.merchant.getOperators()[this.currentIndex];
       this.userManager.setPin(this.adminPassword).then(o=>{
        operator.pin = o;
        alert("encrypted password: '"+ JSON.stringify(o)+"' from adminPassword: "+this.adminPassword);
        let pswrd = this.userManager.getPin(operator);
        
        alert("stored pin is: "+  JSON.stringify(operator.pin))+" decrypted pin is: "+this.userManager.getPin(operator);
        });
    }

    SelectAdmin(pos:string){
        let no = parseInt(pos);

        this.currentIndex = no-1;
        //let operator:Operator = this.merchant.getOperators()[index];


    }

    toggleOperatorEnabled(i:number){
        let ops:any[] = this.merchant.getOperators();
        console.log(">>> toggleOperatorEnabled("+i+") where length is: "+JSON.stringify(ops));
        this.merchant.getOperators()[i].enabled = !(this.merchant.getOperators()[i].enabled);
    }

    delOperator(pos:string){
        console.log("?????????????????  POS: "+pos);
        let no = parseInt(pos);
        this.toggleOperatorEnabled(no-1);
    }   

    addAdmin():Operator{
        let o:Operator = new Operator();
        o.isAdmin = true;
        let password = "1234";
        this.userManager.setPin(password).then(v=>{
            o.pin = v;
            this.merchant.addOperator(o);
            this.operatorPassword.push(password);
        });

    return o;

    }

    addOperator():Operator{
        let o:Operator = new Operator();
        this.merchant.addOperator(o);
        this.operatorPassword.push("1234");
    return o;
    }

    public getPermissionOptions():any[]{
        return [
            {name:"System Admin (full access)", id:"isAdmin", value:false},
            {name:"Cash Register (default)", id:"cash", value:true},
            {name:"Perform Chargebacks", id:"chargback", value:false},
            {name:"Topup Fastpass", id:"topup", value:false},
            {name:"Mobile Topup", id:"mobilerecharge", value:false},
            {name:"Bill Pay", id:"billpay", value:"false"}];
    };


    slideChanged(){
       this.currentStep = this.slides.getActiveIndex();
       this.saveData();
    }

    goto(index:number){
        this.slides.lockSwipes(false);
        this.slides.slideTo(index);
        this.slides.lockSwipes(true);
    }

    btnPress(s:string){
        console.log("Click detected: '"+s+"'");
        console.log("Step before change is: '"+this.currentStep+"' of: '"+(this.slides.length()-1)+"'");
        console.log("N: '"+this.currentStep+"'");
        switch(s){
            case "next":
                if( (this.currentStep < this.slides.length()-1)){
                    this.slides.lockSwipes(false);
                    this.slides.slideNext()
                    this.slides.lockSwipes(true);
                }
                else{
                   //encrypt the operator pins and store

                   let load = this.loadingCtrl.create({content: 'Saving Merchant ... please wait'});
                   load.present();
                   load.setShowBackdrop(true);

                   for(let i=0; i<this.operatorPassword.length;i++){ 
                       this.userManager.setPin(this.operatorPassword[i]).then(o=>{
                           this.merchant.getOperators()[i].pin= o;
                       });
                       load.setContent("encrypting operator: "+(i+1)+" of "+this.operatorPassword.length);
                   }
                   load.dismiss();
                   
                   //save merchant in the database
                   let confirm = this.alertController.create({ 
                       title:'Save Merchant Information',
                       subTitle:'You are about to save your merchant data . . . do you wish to proceed?',
                       buttons:[{
                           text:'Continue',
                           role:'ok',
                           handler: data=>{
                                this.merchantManager.save(this.merchant).then(o=>{
                                    console.log(">>>>>>>> Merchant Data Saved returned: "+JSON.stringify(o));

                                    //save terminal to server
                                    let t:Terminal = new Terminal();
                                    t._id = "terminal_"+this.terminalId;
                                    t.merchantIds.push(this.merchant._id);
                                    alert("put from setup");
                                    this.merchantManager.fastPassDb.put(t._id,t).then(a1=>{
                                        console.log(">>>>>>>> Merchant Data Saved returned: "+JSON.stringify(o));
                                        this.merchantManager.set_localMerchants(t).then(()=>{
                                            console.log(">>>>>>>> About to push to MenuPage: ");

                                            this.navCtrl.push(MenuPage);
                                            //this.merchantManager.set_CurrentMerchant(this.merchant);
                                        })  
                                                      
                                    });

                                }).catch(err=>{
                                    console.log("*********** error Saving Merchant: "+JSON.stringify(err));
                                });
                           }
                       },{
                           text:'Edit',
                           role:'cancel',

                       }]
                       
                       
                   });
                   confirm.present();
                }
                
            break;

            case "prev":
                if(this.currentStep > 0 ){
                    this.slides.lockSwipes(false);
                    this.slides.slidePrev();
                    this.slides.lockSwipes(true);

                }
            break;


        }
    }

    showPrev:boolean = true;
    showNext:boolean = true;
    adminUsername:string = "";
    adminPassword:string="";
    adminDisplayName:string="";

    saveData(){
        
        let activeIndex = this.slides.getActiveIndex();
        let prevIndex = this.slides.getPreviousIndex();
        console.log("@ Save data with activeIndex: "+activeIndex + "and prevIndex: "+prevIndex);


        this.showPrev = true;
        this.showNext = true;
        this.btnPrev.setElementStyle("display","inline-block");
        this.btnNext.setElementStyle("display","inline-block");
        
        //if this is the first screen
        if(activeIndex == 0){
            this.btnPrev.setElementStyle("display","none");
            this.showPrev = false;
        }
        else if(activeIndex == this.slides._slides.length-1){
            //this.btnNext.setElementStyle("display","none");
            this.showNext = false;
            
        }
        


        //if previous screen was second 1st - save the Merchant Details
        if(prevIndex == 0){
            this.showMerchant = JSON.stringify(this.merchant);

        }

        //if previous screen was second Screen - save the Admin Login Data
        if(prevIndex == 2){


            /*
            //create an admin operator
            let adm:Operator = new Operator();
            adm.isAdmin = true;
            adm.name = this.adminUsername;
            adm.password = this.adminPassword;
            adm.displayName = this.adminDisplayName;

            this.merchant.setOperator(0,adm);
            */
        }

        //if this is  the last screen
        console.log(">>> at step: "+ this.currentStep +" of: " + (this.slides.length()-1 + ""));
        if(this.currentStep == this.slides.length()-1){
            this.btnNextText = "SAVE";
            this.btnBackText = "< EDIT";
            //this.btnNext.setElementStyle("color","danger");
        }
        else{
            this.btnNextText = "NEXT >";
            this.btnBackText = "< BACK";
        }
    }


    getOperators(){
        if(this.merchant){
            //console.log(">>>>>>> SetupPage.getOperators: loggin merchant: "+JSON.stringify(this.merchant));
            return this.merchant.getOperators();
        }
        return [];
        
    }
    checkMerchant(){
        console.log(">>>>> SetupPage.checkMerchant() entered");
       let loading =  this.loadingCtrl.create({
           content:"Checking for existing merchant . . .please wait"
       });
       loading.present();

       console.log(">>>>> SetupPage.checkMerchant() getting merchant");

      this.merchantManager.get_Merchant(this.merchant._id).then(m=>{
            //show returned merchant
            console.log(">>>>> SetupPage.checkMerchant() m: "+JSON.stringify(m));

            //set the merchant object to returned m
            this.merchant = m;
            loading.dismiss();
        }).catch(err=>{
            console.log("******* SetupPage.checkMerchant() error getting merchant: "+JSON.stringify(err));
            loading.dismiss();

      });



    }





    uuidv4():string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      }
      
}