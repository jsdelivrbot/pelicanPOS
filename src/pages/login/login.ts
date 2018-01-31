import { Component, ElementRef } from "@angular/core";
import { AlertController } from "ionic-angular";
import { ModalController } from "ionic-angular";
import { NavController } from "ionic-angular";
import { UserManager } from "../../providers/userManager";
import { User } from "../../classes/user";
import { NavParams } from "ionic-angular";
import { HostListener } from "@angular/core";
import { ViewChild } from "@angular/core";
import { Input } from "@angular/core";
import { AfterViewInit } from "@angular/core";
import { asNativeElements } from "@angular/core/src/debug/debug_node";
import { MerchantManager } from "../../providers/merchantManager";
import { Merchant } from "../../classes/merchant";
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
import {Operator} from "../../classes/operator";
import {MenuPage} from "../../pages/menu/menu";
import { SetupPage } from "../../pages/setup/setup";



@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})

export class LoginPage implements AfterViewInit {

    @HostListener('document:keydown', ['$event'])
    
    handleKeyboardEvent(event: KeyboardEvent) { 

        console.log("Fired:" + JSON.stringify(event));
        this.isCodeWrong = false;
        let c:number = event.keyCode;
        switch(c){
            case 8:
                //if backspace pressed, remove last character if string is not empty
               this.code = (this.code.length > 0?this.code.substring(0,this.code.length-1):this.code);  
            break;
            default:
                //otherwise add to string
                if(this.code.length < this.codeLength){
                    this.code +=String.fromCharCode(c);
                }
            break;
        }

        this.updateFields();
        if(this.code.length == this.codeLength){
            this.login();
        }
               
        console.log("KEY PRESS IS: charCode:" + c);
        console.log("Key value is: " + String.fromCharCode(c));
        console.log("Code  is: " +this.code);
    }



    //keypress 
    key:any;
    code:string = "";

    isPressed = false;
    codeLength:number=7;

    char1=""
    char2=""
    char3=""
    char4=""
    char5=""
    char6=""
    char7=""
    merchant:Merchant = new Merchant();


    //login credentials
    merchantId:string = null;
    userId:string = null;
    password:string = null;
    isCodeWrong:boolean = true;

    constructor(public userManager:UserManager, public merchantManager:MerchantManager,  public navParams:NavParams, public navCtrl:NavController,  public alertCtrl:AlertController, public modalCtrl:ModalController){

        console.log("Current Merchant is: "+this.merchantManager.get_CurrentMerchant());
        this.merchant = merchantManager.get_CurrentMerchant();
        //setting Merchant manually for now
         console.log("H2");
        
    }


    public ngAfterViewInit(): void {
        console.log("H4");
        //alert("stop");
    }

    //keypress
    type(val){
        console.log(" >>>>> val is: "+val);
        switch(val){
            case "<":
                this.code = (this.code.length > 0?this.code.substring(0,this.code.length-1):this.code);  
            break;
            default:
                this.code += (this.code.length < this.codeLength ?val:"");
            break;
        }
        console.log(" >>>>> code is: "+this.code);
        this.updateFields();
        if(this.code.length == this.codeLength){
            this.login();
        }
    }

    login(){
        //alert("checking login");
        
        console.log("H3");
        if(true){
            this.merchantManager.setOperatorAsCurrent(this.code).then(isSet=>{

                console.log("IS SET IS: "+isSet);
                if(isSet){
                    this.navCtrl.push(MenuPage);
                } 
                else{
                    this.isCodeWrong = true;
                }
                this.code = "";
                this.updateFields();
    
            });
        }
    }

    goToSetup(){
        this.navCtrl.push(SetupPage);
    }
    updateFields(){
        console.log("H5");
        
        for(let i=0; i<this.codeLength; i++){
            switch(i){
                case 0:
                    this.char1 =  this.code.length >= i? this.code.substring(i,i+1):"";
                break;
            
                case 1:
                    this.char2 = this.code.length >= i? this.code.substring(i,i+1):"";
                break;
                
                case 2:
                    this.char3 =this.code.length >= i? this.code.substring(i,i+1):"";
                break;
                

                case 3:
                    this.char4 =this.code.length >= i? this.code.substring(i,i+1):"";
                break;

                case 4:
                    this.char5 =this.code.length >= i? this.code.substring(i,i+1):"";
                break;

                case 5:
                    this.char6 =this.code.length >= i? this.code.substring(i,i+1):"";
                break;

                case 6:
                    this.char7 =this.code.length >= i? this.code.substring(i,i+1):"";
                break;
                

            }
        
        }
    }

    /*
    createUser(){
        //update tmpUser status to active
        this.userManager.getUser(this).then(u=>{
            console.log("validating temp User: "+JSON.stringify(this.tmpUser)+" setting localuser doc with: u"+ JSON.stringify({_id:"_local/startup", username: u._id}));
            //user successfully validate
            // make local non sync record
        }).catch(err=>{
            console.log(" *******  VerifyPage.createUser() error validating user from userManager.validate("+JSON.stringify(this.tmpUser)+") "+JSON.stringify(err));
        });
    }
    */
}