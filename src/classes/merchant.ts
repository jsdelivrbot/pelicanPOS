import {Injectable } from "@angular/core";
import { User } from "../classes/user";
import {Operator} from "../classes/operator";



@Injectable()
export class Merchant extends User {
    _id:string ="";
    _rev:string = "";
    displayName:string = "";
    private operators:Operator[] = [];
    userPermissions:any = {};
    group:string = "Merchant";
    operatorNumber:string = "";

    constructor(){
        super();
    }

    numberOfOperators():number{
        return this.operators.length;
    }

    addOperator(operator:Operator){

        let num:number =0;
        let newNum:string = "";

        num = this.operators.length+1;
            newNum =  (num > 99?num.toString():(num > 9?"0"+num:"00"+num));
            console.log("merchant.addOperator(o): original operatorNumber is: "+ operator.operatorNumber+" so setting it to: "+newNum);
            operator.operatorNumber = newNum;
            this.operators.push(operator);
    }

    setOperator(position:number, operator:Operator){
        let newNum:string =  (position > 99?position.toString():(position > 9?"0"+position:"00"+position));
        this.operators[position] = operator;
    }



    getOperators(role?:string):Operator[]{
        let ops:Operator[] = [];

        if(!role){
            ops = this.operators;
        }
        else{
        

            this.operators.forEach(o=>{
                if(role.trim().toLowerCase() == "isadmin"){
                    if(o.isAdmin){
                        ops.push(o);
                    } 
                }else if(role.trim().toLowerCase() == "networkadmin"){
                    if(o.isNetworkAdmin){
                        ops.push(o);
                    }
                }else if(role.trim().toLowerCase() == "!administrator"){
                    if(!o.isNetworkAdmin && !o.isAdmin ){
                        ops.push(o);
                    }
                }
                else{
                    o.permissions.forEach((p)=>{
                        if(p.itemName.trim().toLowerCase() == role.trim().toLowerCase()){
                            ops.push(o);
                        }
                    });
                }
            });
        }
        return ops
    }

    static setData(data:Merchant):Merchant{
        if(data == null){
            return null;
        }

        let m = new Merchant();
        m._id               =data._id           ;    
        m._rev              =data._rev          ;    
        m.activeAccount     =data.activeAccount ;    
        m.cyclosUser        =data.cyclosUser    ;   
        m.displayName       =data.displayName   ;   
        m.email             =data.email         ;    
        m.group             =data.group         ;    
        m.loginName         =data.loginName     ;   
        m.name              =data.name          ;   
        m.operatorNumber    =data.operatorNumber;   
        m.operators         =data.operators     ;    
        m.password          =data.password      ;   
        m.phoneNumbers      =data.phoneNumbers  ;   
        m.pin               =data.pin           ;    
        m.securityQuestions =data.securityQuestions; 
        m.sources           =data.sources       ;   
        m.type              =data.type          ;   
        m.userData          =data.userData      ;   
        m.userPermissions   =data.userPermissions;
        return m;
    }

}