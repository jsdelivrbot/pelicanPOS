import { Account } from '../classes/account';
import { UserData } from '../classes/userData';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Card } from '../classes/card';

export class User{

    _id:string;
    _rev:string;


    userData:UserData;

    displayName:string="";
    phoneNumbers:any=[];
    group:string = "Users";
    name:string;
    loginName:string;
    username:string;
    email:string;
    sources:Card[];
    password = "";
    pin:Uint8Array = null;
    securityQuestions = {"question1":"", "question2":"","question3":"","answer1":"","answer2":"","answer3":"",}
    activeAccount: Account;
    type = "User";

    
    cyclosUser:any;

    private _password:string;
}