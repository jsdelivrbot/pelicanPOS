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

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;

    rootPage: any = SetupPage;

    pages: Array<{ title: string, component: any }>;

    constructor(
        public platform: Platform,
        public statusBar: StatusBar,
        public splashScreen: SplashScreen,
        private screenOrientation: ScreenOrientation,
        public userManager:UserManager,
        public merchantManager:MerchantManager,
        private app:App) {

            app.viewWillEnter.subscribe(() =>{
                try{         
                }catch(err){
                    alert("app.viewWillEnter.subscribe error: "+JSON.stringify(err));    
                }   

            });            
            
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
