import {Injectable } from "@angular/core";
import { User } from "../classes/user";
import { Operator } from "../classes/Operator";

@Injectable()
export class Merchant extends User {
    _id:string ="";
    _rev:string = "";
    displayName:string = "";
    operators:Operator[] = [];
    userPermissions:any = {};
    group:string = "merchants";

    constructor(){
        super();
    }
}