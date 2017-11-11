import { Class, Component, Inject, Injectable } from '@angular/core';
import { UUID } from 'angular2-uuid';

export class Item{

    _id:String = UUID.UUID();
    _rev:String;

    type:String;
    icon:String;
    title:String;
    value?:number;
    category:String;
    keywords:String[];
    variants:any[];
    modifiers:any[];
    notes:string;
    constructor(){}
    
}