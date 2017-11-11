
import { Item } from './../classes/Item';
import { Injectable } from '@angular/core';

@Injectable()
export class InventoryManager{

    private _inventoryManager:any;
    private _items:Item[] = [];

    constructor(){
        //this.loadItems();
     }


     public getItems():Promise<any> {
        //this.event.publish('user:itemadded',this._items);
        return new Promise<Item[]>( (resolve, reject) =>{

                console.log(">>> InventoryManager.ts >> getItems() called");
                this._items.push(this.setItem("1","","product","darkgrey","Product 1","Products",["product","one","1"],[],[],100));
                this._items.push(this.setItem("2","","product","darkgrey","Product 2","Products",["product","two","2"],[],[],200));
                this._items.push(this.setItem("3","","product","darkgrey","Product 3","Products",["product","three","3"],[],[],300));
                this._items.push(this.setItem("4","","product","darkgrey","Product 4","Products",["product","four","4"],[],[],400));
                this._items.push(this.setItem("5","","product","darkgrey","Product 5","Products",["product","five","5"],[],[],500));
                this._items.push(this.setItem("6","","product","darkgrey","Product 6","Products",["product","six","6"],[],[],600));
                this._items.push(this.setItem("7","","product","darkgrey","Product 7","Products",["product","seven","7"],[],[],700));

                if(this._items.length >0){
                    console.log(">>> InventoryManager.ts >> getItems() resolved");
                    resolve(this._items);
                    
                }
                else
                {
                    console.log(">>> InventoryManager.ts >> getItems() error: ");
                    reject("error");
                }
            });

        }

        public filterItems(searchTerm){
            return this._items.filter((item)=> {
                return item.title.toLocaleLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
            });
        }

        public NoOfItems():number{
            return this._items.length;
        }

        
    //method to create a new Item 
    setItem( _id:String, _rev:String, type:String,icon:String,
        title:String, category:String, keywords:String[], variants:any[], modifiers:any[],
        value?:number):Item{
            
            let i = new Item();
            i._id = _id;
            i._rev = _rev;
            i.category = category;
            i.icon = icon;
            i.keywords = keywords;
            i.modifiers = modifiers;
            i.title = title;
            i.type = type;
            i.value = value;
            i.variants = variants;
            return i;

        }

        addItem(item:Item){
            this._items.push(item);
            //this.event.publish('Item:added',this.getItems());
        }    
    }