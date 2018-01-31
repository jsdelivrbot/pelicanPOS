import { Injectable } from "@angular/core";
import { Operator, Permission } from "../classes/operator";



//MenuItem to display
@Injectable()
export class MenuItem{

    displayName:string ="";
    program_id:string ="";
    position:number=0;
    requiresPermissions:any[] = [];
    icon:string ="";
    bgColor:string;
    launch_app:any;

    constructor(){}
    
    canOpen(operator:Operator){
        let isAuth = false;
        operator.permissions.forEach(e => {
            if((e.itemId == this.program_id && e.canOpen) || (operator.isAdmin || operator.isNetworkAdmin)){
                isAuth = true;
                return
            }
        });
        return isAuth;
    }
}