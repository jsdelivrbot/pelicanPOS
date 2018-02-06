import { Pipe, PipeTransform } from '@angular/core';
import { parseDate, DateTimeData } from 'ionic-angular/util/datetime-util';

/**
 * Generated class for the SortPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'sort',
})
export class SortPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  sortDataType:string;
  sortOrder:number;
  sortBy:string;

   transform(items:any[], sortArgs:any) {

      this.sortDataType = sortArgs.sortDataType;
      this.sortOrder = sortArgs.sortOrder;
      this.sortBy = sortArgs.sortBy;
    
      console.log(">>> items[0] is: "+ JSON.stringify(items[0]));
      console.log(">>> sortArgs is: "+ JSON.stringify(sortArgs));
      console.log(">>> sortDataType is: "+this.sortDataType);
      console.log(">>> sortOrder is: "+this.sortOrder);
      console.log(">>> sortBy is: "+ this.sortBy);

      let s =  items.sort((a,b)=>{
        
        console.log(">>> sortType.toLowerCase() is: "+this.sortDataType.toLowerCase());
        
        if(this.sortDataType.toLowerCase() == "date"){

          let aVal:Date = this.getDate(a[this.sortBy]);
          let bVal:Date = this.getDate(b[this.sortBy]);

          return aVal>bVal?-1:bVal>aVal?1:0;
          //console.log(">>> SortPipe.transform() parseDate for a: "+ aDate);
        }
        else{

          if(a[this.sortBy] > b[this.sortBy]){ 
            return (-1 * this.sortOrder);
          }
          else if(a[this.sortBy] < b[this.sortBy]){
              return (1 * this.sortOrder);
          }
          else { return 0;  
          }

        }
      });
      s.forEach(o=>{
        o["date"] = this.getDate(o["id"]);
      });
      console.log("will output: "+JSON.stringify(s));
      return s;
  }

  getDate(a:any):Date{
        console.log(">>> getData(a): a is: "+JSON.stringify(a));
        let aParts:string[] = a.split("_");
        let aStringpart = aParts[aParts.length-1];
        let aDate = parseDate(aStringpart);
        let aDateParts:string[] = aStringpart.split("@");
        let atime:string = aDateParts[1].substring(0,2) + ":"+aDateParts[1].substring(2,4) + ":"+aDateParts[1].substring(4,6)
        let aString = aDateParts[0]+"T"+ atime+"Z";
        let aVal:Date = new Date(aString);
        //console.log(">>> SortPipe.transform() ID to Date for a: "+ aStringpart);
      return aVal;
  }
}
