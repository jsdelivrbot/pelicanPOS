import { DetailPage } from './../pages/detail/detail';

import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { ItemsPage } from '../pages/items/items';
import { KeypadPage } from '../pages/keypad/keypad';
import { MenuPage } from '../pages/menu/menu';
import { NavController } from 'ionic-angular/navigation/nav-controller';
import { UserManager } from '../providers/userManager';
import { MerchantManager } from '../providers/merchantManager';
import { LoginPage } from '../pages/login/login';
import { retry } from 'rxjs/operator/retry';
import { App } from 'ionic-angular';
import { SetupPage } from '../pages/setup/setup';
import { Terminal } from '../classes/terminal';
import { Merchant } from '../classes/merchant';

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;

    rootPage: any;
    myPage:any;
    public merchantManager:MerchantManager;
    public userManager:UserManager;

    pages: Array<{ title: string, component: any }>;

    constructor(
        public platform: Platform,
        public statusBar: StatusBar,
        public splashScreen: SplashScreen,
        private screenOrientation: ScreenOrientation,
        public um:UserManager,
        public mm:MerchantManager,
        private app:App) {

    
        this.merchantManager = mm;
        this.userManager = um;            
        this.initializeApp();
        //this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);


        // used for an example of ngFor and navigation
        this.pages = [
            { title: 'Home', component: HomePage },
            { title: 'List', component: ListPage },
            { title: 'Items', component: ItemsPage },
            { title: 'Keypad', component: KeypadPage },
            { title: 'Detail', component: DetailPage }
        ];

    }

    initializeApp() {
        this.platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            this.statusBar.styleDefault();
            this.splashScreen.hide();

            console.log(">>>>> app.components.initializeApp() getting _local/fastPassPOS");
            this.merchantManager.get_localMerchants().then(t=>{
                console.log(">>>>> app.components.initializeApp() _local/fastPassPOS is: "+JSON.stringify(t));
                if(t){
                   //there is a local terminal setting active
                   let term:Terminal = (t as Terminal);
                   //console.log(">>>>> app.components.initializeApp() _local/fastPassPOS: "+JSON.stringify(t));

                       //only 1 associated merchant was found so set as default
                       console.log(">>>>> app.components.initializeApp() number of merchants found: "+term.merchantIds.length);
                       this.merchantManager.get_Merchant(term.merchantIds[0]).then(m=>{
                            console.log(">>>>> app.components.initializeApp() setting current merchant as: "+JSON.stringify(m));
                            this.merchantManager.set_CurrentMerchant(m);
                            this.myPage = MenuPage;
                                //this.nav.push(MenuPage,{"merchant":m });

                            //Merchant is set now determine if a user is known
                            if(!this.userManager.get_currentUser()){
                                this.myPage = LoginPage;
                            } 
                            this.nav.setRoot(this.myPage);
                        });
                }
                else{
                    this.nav.setRoot(SetupPage);
                }

            }).catch(err=>{
                console.log("************ app.components.initializeApp()error getting Merchant going to setup page: "+JSON.stringify(err));
                this.nav.setRoot(SetupPage);
                
            }); //END OF TERMINAL
            
           //set subscription for every page enter to check for currentMerchant
           this.app.viewWillEnter.subscribe(() =>{
            try{ 

                console.log(">>>>> app.components.constructor() app.viewWillEnter subscription called: ");
                if(!this.merchantManager.get_CurrentMerchant() && this.app.getActiveNav().getActive().name != "LoginPage"){
                    console.log(">>>>> app.components.constructor() app.viewWillEnter subscription called because no Current Merchant is found: ");
                    this.rootPage = SetupPage;
                    console.log(">>>>> app.components.constructor() app.viewWillEnter subscription setting rootPage to SetupPage: ");
                }else{
                    //current merchant found checking for currentUser
                    let u = this.userManager.get_currentUser();
                    //alert("Current User is: "+JSON.stringify(u));
                    
                    if(!this.userManager.get_currentUser()){
                        console.log(">>>>> app.components.constructor() app.viewWillEnter subscription setting rootPage to Login, Merchant found, but no current user: ");
                        console.log(">>>>> app.components.constructor() app.viewWillEnter this.nav.getActive().name: "+this.nav.getActive().name + " ; LoginPage.name: "+ LoginPage.name);
                        if(this.nav.getActive().name!=  "LoginPage" && this.nav.getActive().name!=  "SetupPage"){
                            //alert("Going to LoginPage after Merchant: "+ JSON.stringify(this.merchantManager.get_CurrentMerchant()));
                            this.nav.push(LoginPage);
                        }
                        
                    }
                }
            }catch(err){
                alert("app.viewWillEnter.subscribe error: "+JSON.stringify(err));    
            }   

        });             
        });
      
    }

    openPage(page) {
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        this.nav.setRoot(page.component);
    }

    ionViewCanEnter():boolean{
        alert("Enter at your own risk");
        return false;
    }

    ionViewCanLeave():boolean{
        alert("leaving");
        console.log("++++++++++++++++++++++++++ ionViewCanLeave");
        this.userManager.set_CurrentUser(null);
        if(!this.userManager.get_currentUser()){
            this.openPage(LoginPage);
            return false;
        }
        return true;
    }
}
