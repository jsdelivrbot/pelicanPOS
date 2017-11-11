import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { ItemsPage } from '../pages/items/items';
import { KeypadPage } from '../pages/keypad/keypad';
import { DetailPage } from '../pages/detail/detail';
import {PayMethodPage} from '../pages/paymethod/paymethod'

import {InventoryManager} from '../providers/InventoryManager';
import {TransactionManager} from '../providers/TransactionManager';


import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

import { SuperTabsModule } from 'ionic2-super-tabs';
import { UUID } from 'angular2-uuid';
import { PayAmountPage } from '../pages/payamount/payamount';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    ItemsPage,
    KeypadPage,
    DetailPage,
    PayMethodPage,
    PayAmountPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    SuperTabsModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    ItemsPage,
    KeypadPage,
    DetailPage,
    PayMethodPage,
    PayAmountPage
  ],
  providers: [
    InventoryManager,
    TransactionManager,
    StatusBar,
    SplashScreen,
    ScreenOrientation,
    UUID,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
