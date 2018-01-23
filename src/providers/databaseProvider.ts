import { Injectable, EventEmitter } from '@angular/core';
import PouchDB from 'pouchdb' ;
import { Config } from '../providers/configProvider';

@Injectable()
export class DatabaseProvider {

    private isInstantiated: boolean = false;
    private database: PouchDB;
    private listener: EventEmitter<any> = new EventEmitter();
    private config:Config = new Config();

    remote: string; // = "http://ec2-184-72-71-40.compute-1.amazonaws.com:5984/fastpass_pos"; //"https://couchdb.cloudno.de/fastpass"; // "http://localhost:5984/fastpass";

    public constructor() {

        if (!this.isInstantiated) {
           
            this.remote = this.config.get_POS_SERVER();
            this.database = new PouchDB('fastpass_pos');
            let remoteDB:PouchDB = new PouchDB(this.remote);

            let options = {
                live: true,
                retry: false,
                continuous: true
            };


            
            console.log("databaseProvider().constructor(): this.remote: '"+this.remote+"'");
            this.database.sync(remoteDB, options).on('error', function(err){
                console.log("**** databaseProvider(): remote: "+this.remote+" - DB SYNCH Change: "+JSON.stringify(err));
            })
            .on('change', function(change){
                console.log(">>>> databaseProvider(): remote: "+this.remote+" - DB SYNCH CHANGE: "+JSON.stringify(change));
            });


            remoteDB.sync(remoteDB, options).on('error', function(err){
                console.log("**** databaseProvider(): remote: "+this.remote+" - DB SYNCH Change: "+JSON.stringify(err));
            })
            .on('change', function(change){
                console.log(">>>> databaseProvider(): remote: "+this.remote+" - DB SYNCH CHANGE: "+JSON.stringify(change));
            });


            this.isInstantiated = true;
        }
    }

    public fetch() {
        return this.database.allDocs({ include_docs: true });
    }

    public get(id: string) {
        return this.database.get(id);
    }



    public put(id: string, document: any):Promise<any> {

        return new Promise<any>((response,reject)=>{
            console.log(">>> databaseProvider.put(id: ["+id+"],doc:[" + JSON.stringify(document)+"] to:  "+ JSON.stringify( this.remote));
            try{
                let o = this.database.put(document);
                console.log("   >>> databaseProvider.put(id:,doc): response is: "+JSON.stringify(o));
                response(o);
            }catch(ex){
                console.log("   *** databaseProvider.put(id:,doc): response is: "+JSON.stringify(ex));
                reject(ex);
            }
        });
    }
    

    public sync(remote: string) {
        let remoteDatabase = new PouchDB(remote);
        this.database.sync(remoteDatabase, {
            live: true
        }).on('change', change => {
            this.listener.emit(change);
        }).on('error', error => {
            console.error(JSON.stringify(error));
        });
    }

    public getChangeListener() {
        return this.listener;
    }


    public changes(obj:any) {
        return this.database.changes(obj);
    }

    public find(obj:any) {
        return this.database.find(obj);
    }

    public remove(obj:any){
        return this.database.remove(obj);
    }

}
