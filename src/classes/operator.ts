import { User } from "../classes/user";

export class Operator extends User{


    operatorNumber:string;
    enabled:boolean = true;
    permissions:Permission[] =[];
    isAdmin:boolean = false;
    isNetworkAdmin:boolean = false;
    
    constructor(){
        super();
    }
}

export class Permission{
    itemId:string;
    itemName:string;
    userTier:number = UserTier.None ;
    canOpen:boolean = false;
    canRead:boolean = false;
    canWrite:boolean = false;
    canExecute:boolean = false;
    

    constructor(){

    }
}

export class UserTier{
    public static NetworkAdmin:number = 999;
    public static SystemAdmin:number = 888;
    public static User:number = 100;
    public static None:number = 0;
}