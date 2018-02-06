import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the SearchPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'search',
})
export class SearchPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(items:any[], terms:any):any[] {

    let val:any[] = [];

    if(!terms) return items;
    if(!items) return val;

    let to = (terms.to)?terms.to.toLowerCase():"";
    let from = (terms.from)?terms.from.toLowerCase():"";
    let type = (terms.type)?terms.type.toLowerCase():"";
    let keyword = (terms.keyword)?terms.keyword.toLowerCase():"";

    items.forEach(item=>{
      let pushVal = false; // if pushval then add to array

      if(to && item.to.toLowerCase().includes(to)){   //if a {to:"tovalue"} exists the this can be entered
        pushVal = true;  
      }
      
      if(pushVal && from && item.from.toLowerCase().includes(from)){  //if toVal passed (pushval is true) && other terms met then might be true
        pushVal = true;  
      }
      
      
      if(pushVal && type && item.type.toLowerCase().includes(type)){
        pushVal = true;  
      }
      
      
      if(pushVal && keyword && item.doc.description.toLowerCase().includes(type)){
        pushVal = true;  
      }
      
      if(pushVal){
        val.push(item);
      }
        
    });
    return val;
  }
}
