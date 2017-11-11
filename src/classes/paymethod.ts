import { UUID } from "angular2-uuid";



export class PayMethod{
    _id:string = UUID.UUID();
    _rev:string="";

    name:string="";
    icon:string;

    constructor(){}
}