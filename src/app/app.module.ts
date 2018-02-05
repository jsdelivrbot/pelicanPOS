import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { ItemsPage } from '../pages/items/items';
import { MenuPage } from '../pages/menu/menu';
import { TopupPage } from '../pages/topup/topup';
import { KeypadPage } from '../pages/keypad/keypad';
import { DetailPage } from '../pages/detail/detail';
import {PayMethodPage} from '../pages/paymethod/paymethod'

import {InventoryManager} from '../providers/InventoryManager';
import {TransactionManager} from '../providers/TransactionManager';

import {DatabaseProvider} from '../providers/databaseProvider';
import {EncryptionService} from '../providers/encryptionService';
import {PouchDBService} from '../providers/pouchdb.service';
import {pouchdb} from 'pouchdb';
import {UserManager} from '../providers/userManager';
import {MerchantManager} from '../providers/merchantManager';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

import { SuperTabsModule } from 'ionic2-super-tabs';
import { UUID } from 'angular2-uuid';
import { PayAmountPage } from '../pages/payamount/payamount';
import { ScanPage } from '../pages/scan/scan';
import { ConfirmPayPage } from '../pages/confirmpay/confirmpay';
import { LoginPage } from '../pages/login/login';
import { Config} from '../providers/configProvider';

import { HTTP } from '@ionic-native/http';
import { CurrencyPipe } from '@angular/common';

import {Crypto} from '../providers/crypto';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
import { SetupPage } from '../pages/setup/setup';
import {TransactionPage} from '../pages/transaction/transaction';

import {PipesModule} from '../pipes/pipes.module';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    ItemsPage,
    MenuPage,
    TopupPage,
    KeypadPage,
    DetailPage,
    PayMethodPage,
    PayAmountPage,
    ScanPage,
    ConfirmPayPage,
    LoginPage,
    SetupPage,
    TransactionPage,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    SuperTabsModule.forRoot(),
    PipesModule

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    ItemsPage,
    MenuPage,
    TopupPage,
    KeypadPage,
    DetailPage,
    PayMethodPage,
    PayAmountPage,
    ScanPage,
    ConfirmPayPage,
    LoginPage,
    SetupPage,
    TransactionPage
  ],
  providers: [
    UniqueDeviceID,
    Crypto,
    CurrencyPipe,
    HTTP,
    Config,
    UserManager,
    MerchantManager,
    PouchDBService,
    DatabaseProvider,
    EncryptionService,
    InventoryManager,
    TransactionManager,
    StatusBar,
    SplashScreen,
    ScreenOrientation,
    UUID,
    BarcodeScanner,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
