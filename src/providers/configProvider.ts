import { Injectable } from "@angular/core";
import { PouchDBService } from "../providers/pouchdb.service";



@Injectable()
export class Config{

    private _config:any = {};
    private _lastPulled:number = Date.now();
    private _default = "ec2-54-84-34-18.compute-1.amazonaws.com";
    
    private _base:string;

    constructor(){
        this._base = "http://ec2-54-84-34-18.compute-1.amazonaws.com";
        //decryptConfig
        //1. get encrypted config file from assets/

        //2. decrypt config file to json

        //3. load ConfigFile

        //4. async pull new config file from server

            //4 a) if new Config file _rev is different
                //4 a1) load new config file
                //5 a2) replace config file in assets


    }


    //get Config file
    private getConfig(){
        /*
        this.db.get(".config").then(results => {
            this._config = results;
        });
        */
    }

    //write config file to the assets folder
    private writeConfig(){

    }

    //the location to the pelicanProcessing Server
    get_PELICAN_SERVER():any{


        if(!this._config){
           //this.getConfig(); 
        }
        return this._base +":3000/";
        //return this._config.PELICANSERVER;
    }

    //the location to the pelicanProcessing Server
    get_PELICAN_DB():any{
        
        
                if(!this._config){
                   //this.getConfig(); 
                }
                let res = this._base +":5984/fastpass";
                console.log("Config.get_PELICAN_DB() =>" + res )
                return res
                //return this._config.PELICANSERVER;
            }
    
    //the location to the pelicanProcessing Server
    get_POS_SERVER():any{
        
        if(!this._config){
            //this.getConfig(); 
        }
        return this._base +":5984/fastpass_pos";
    }

    //the location to the fastpas mobile Server
    MOBILE_SERVER():any{
        
        if(!this._config){
            this.getConfig(); 
        }
        return this._config.PELICANSERVER;
    }
        
}