import { Component, ViewChild, ElementRef, Inject, Injectable } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { BarcodeScanner, BarcodeScanResult } from '@ionic-native/barcode-scanner';
import { swipeShouldReset } from 'ionic-angular/util/util';
import { EncryptionService } from '../../providers/encryptionService';
import { Subscriber } from 'rxjs/Subscriber';
import { TransactionManager } from '../../providers/TransactionManager';
import { forwardRef } from '@angular/core';
import { UserData } from '../../classes/userData';
import { ConfirmPayPage } from '../../pages/confirmpay/confirmpay';
import { UserManager } from '../../providers/userManager';
import { User } from '../../classes/user';

/*
  Generated class for the scan page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'page-scan',
    templateUrl: 'scan.html'
})



export class ScanPage {

    type: string;
    value: string;
    isCanceled: boolean = false;
    errorText: string;
    barcodeScanResult:BarcodeScanResult;
    
    userData:UserData;

    sentinals:String[] = []; //two centenals in the first and last characters of the string
    appCode:string = ""; //the code of the registered app that is sending the request, may affect where data is routed.
    date:any;
    subject:string = "";  // the id of the authorizing account
    balance:number =0; //the last known balance on the account
    balCurrency:string; //the currency of the value 
    credit:number=0;  //the amount of credit overage allowed.
    credCurrency:string; //the currency of the value 
    uses:number=0; //the number of uses without requirign authentication




    constructor(public encryt:EncryptionService,
        public navCtrl: NavController,
          public navParams: NavParams,
           private barcodeScanner: BarcodeScanner,
           @Inject(forwardRef(()=> TransactionManager)) public transManager:TransactionManager,
        public userManager:UserManager) {

        barcodeScanner.scan().then((result) => {
            this.scan(result);            
        }).catch((ex) => {
            this.errorText = ex;
            console.log("***************** barcodeScanner.scan() => error: " + ex);
            if(ex.trim().toLowerCase() == "cordova_not_available"){
                console.log("    >>>>>>>>>>>>>> barcodeScanner.scan() => cordova_not_available code running");
                let res:BarcodeScanResult = new Object() as BarcodeScanResult;  
                res.text="ps01-112117034600-8696626032-50000XCD-25000XCD-02p";
                res.format="QR_CODE";
                this.scan(res);
            }

        })
    }
  
        


    scan(result:BarcodeScanResult){

        this.value = result.text;
        this.type = result.format;
        this.isCanceled = result.cancelled;

        switch(result.format.trim().toLowerCase()){
            case "":
                this.navCtrl.pop();
            break;
            default:
                try{
                    console.log("*** ScanPage.barcodescanner.scan() >> 1");
                    this.userData = this.setUser(result);
                    console.log("*** ScanPage.barcodescanner.scan() >> userData is: "+ JSON.stringify(this.userData));
                    
                    let u:User = new User();
                    u._id = this.userData.subject;
                    u.userData = this.userData;

                    this.userManager.set_CurrentUser(u);
                    console.log("*** ScanPage.barcodescanner.scan() >> userManager.currentUser() is set to: "+JSON.stringify(u));
                    
                this.transManager.tender().then(o=>{
                    console.log(">>>> ScanPage.barcodescanner.scan() >> in transManager.tender");
                    this.navCtrl.setRoot(ConfirmPayPage,{"status:": o, "transactionStatus":o});
                    console.log("*** ScanPage.barcodescanner.scan() >> confirm page called, should not be here");
                }).catch(ex=>{
                    console.log("*** Error in: ScanPage.barcodescanner.scan() =>this.transManager.tender() >> "+ex);
                });
                }catch(ex){
                    console.log("*** ScanPage.barcodescanner.scan() >> attempting to create userData and trigger transcation: "+ex);
                }                  
            break;
        }


    }

    setUser(result:BarcodeScanResult){
        let ud:UserData = new UserData(result);
        this.sentinals= ud.sentinals; //two centenals in the first and last characters of the string
        this.appCode= ud.appCode; //the code of the registered app that is sending the request, may affect where data is routed.
        this.date = ud.openDate;
        this.subject= ud.subject;  // the id of the authorizing account
        this.balance= ud.availablebalance; //the last known balance on the account
        this.balCurrency= ud.balCurrency; //the currency of the value 
        this.credit= ud.credit;  //the amount of credit overage allowed.
        this.credCurrency= ud.credCurrency; //the currency of the value 
        this.uses= ud.uses; //the number of uses without requirign authentication
        return ud;

    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad ScanPage');
    }

}
