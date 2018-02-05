import { Injectable, EventEmitter } from '@angular/core';
import PouchDB from 'pouchdb';
import { Config } from '../providers/configProvider';

@Injectable()
export class PouchDBService {

    private isInstantiated: boolean;
    private database: PouchDB;
    private listener: EventEmitter<any> = new EventEmitter();
   

    remote: string;

    public constructor() {

        let config = new Config();
        this.remote = config.get_PELICAN_DB(); //"https://couchdb.cloudno.de/fastpass"; // "http://localhost:5984/fastpass";
        if (!this.isInstantiated) {
           
            this.database = new PouchDB('fastpass');

            let options = {
                live: true,
                retry: true,
                continuous: true
            };

            this.database.sync(this.remote, options).on('change',function (change){
                //console.log("pouchdbservice.constructor()=> onReplicationChanged- remote: "+this.remote+JSON.stringify(change));
            }).on('error', function(err){console.log("pouchdbService(): remote: "+this.remote+" - DB SYNCH ERRROR: "+JSON.stringify(err));});

            this.isInstantiated = true;
        }
    }

    public fetch() {
        return this.database.allDocs({ include_docs: true });
    }

    public query (designView:string, params:any){
        return this.database.query(designView,params);
    }


    public get(id: string):any{

        return this.database.get(id).then(o=>{
            //console.log(">>>>>>>>> PouchbdService.get('"+id+"') here: ");
            //console.log(">>>>>>>>> PouchbdService.get('"+id+"') found: "+JSON.stringify(o));
            return o;
        }).catch(err=>{
            //console.log("********** PouchbdService.get('"+id+"') error: "+JSON.stringify(err));
            return err;
        });
    }

    public remove(id:string){
        this.get(id).then(o=>{
            this.database.remove(o);
            return;
        });
    }

    public put(id: string, document: any) {
        document._id = id;
        return this.get(id).then(result => {
            document._rev = result._rev;
            return this.database.put(document);
        }, error => {
            if (error.status == "404") {
                return this.database.put(document);
            } else {
                return new Promise((resolve, reject) => {
                    reject(error);
                });
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

}
