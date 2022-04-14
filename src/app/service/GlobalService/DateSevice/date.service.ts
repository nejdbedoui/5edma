import { Injectable } from '@angular/core';
import { LocalstorageService } from '../Localstorage/localstorage.service';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  constructor( private _localStorage: LocalstorageService) {  

  }
  lang:string
  GetDate(date:Date){
    var heur:string="";
          let dates:Date=new Date(date);
          var timeZoneDifference = (dates.getTimezoneOffset() / 60) * -1;

      dates.setTime(dates.getTime() - ((timeZoneDifference * 60) * 60 * 1000));
      var minute:string=String(dates.getMinutes())
      if((dates.getHours())<10){
        heur="0"+(dates.getHours())
      }else{
        heur=String((dates.getHours()))
      }
      if(dates.getMinutes()<10){
        minute="0"+dates.getMinutes()
      }
      if((dates.getMonth()+1)<10){
        if((dates.getDate())<10){
            return dates.getFullYear()+'-0'+(dates.getMonth()+1)+'-0'+(dates.getDate()+' '+heur+':'+minute)
        }else{
          return dates.getFullYear()+'-0'+(dates.getMonth()+1)+'-'+(dates.getDate()+' '+heur+':'+minute)
        }
      }else{
        if((dates.getDate())<10){
          return dates.getFullYear()+'-'+(dates.getMonth()+1)+'-0'+(dates.getDate()+' '+heur+':'+minute)
        }else{
          return dates.getFullYear()+'-'+(dates.getMonth()+1)+'-'+(dates.getDate()+' '+heur+':'+minute)
        }
      }
  }
  deletezonehour(date:Date){
    var heur:string="";
    var dates = new Date(date);

    var timeZoneDifference = (dates.getTimezoneOffset() / 60) * -1;

    dates.setTime(dates.getTime() - ((timeZoneDifference * 60) * 60 * 1000));
    return dates
  }

  GetDateDDMMYYYY(date:Date){
    var heur:string="";
          let dates:Date=new Date(date);
          /*Time Zone*/
          //var timeZoneDifference = (dates.getTimezoneOffset() / 60) * -1;
          //dates.setTime(dates.getTime() - ((timeZoneDifference * 60) * 60 * 1000));
      
      if((dates.getMonth()+1)<10){
        if((dates.getDate())<10){
            return dates.getFullYear()+'-0'+(dates.getMonth()+1)+'-0'+(dates.getDate())
        }else{
          return dates.getFullYear()+'-0'+(dates.getMonth()+1)+'-'+(dates.getDate())
        }
      }else{
        if((dates.getDate())<10){
          return dates.getFullYear()+'-'+(dates.getMonth()+1)+'-0'+(dates.getDate())
        }else{
          return dates.getFullYear()+'-'+(dates.getMonth()+1)+'-'+(dates.getDate())
        }
      }
  }

  GetDateDDMMYYYYHHMM(date:Date){
    var heur:string="";
          let dates:Date=new Date(date);
      // var timeZoneDifference = (dates.getTimezoneOffset() / 60) * -1;
      //dates.setTime(dates.getTime() - ((timeZoneDifference * 60) * 60 * 1000));
      var minute:string=String(dates.getMinutes())
      if((dates.getHours())<10){
        heur="0"+(dates.getHours())
      }else{
        heur=String((dates.getHours()))
      }
      if(dates.getMinutes()<10){
        minute="0"+dates.getMinutes()
      }
      if((dates.getMonth()+1)<10){
        if((dates.getDate())<10){
            return dates.getFullYear()+'-0'+(dates.getMonth()+1)+'-0'+(dates.getDate()+' '+heur+':'+minute)
        }else{
          return dates.getFullYear()+'-0'+(dates.getMonth()+1)+'-'+(dates.getDate()+' '+heur+':'+minute)
        }
      }else{
        if((dates.getDate())<10){
          return dates.getFullYear()+'-'+(dates.getMonth()+1)+'-0'+(dates.getDate()+' '+heur+':'+minute)
        }else{
          return dates.getFullYear()+'-'+(dates.getMonth()+1)+'-'+(dates.getDate()+' '+heur+':'+minute)
        }
      }
  }

  getDurationwithdate(date:Date,lang:string){
    let dates:Date=new Date(date);
    //this.deletezonehour(dates);
    let duration : any;
    let currentDate : Date =  new Date()
    

    duration = (currentDate.getTime() - dates.getTime())/(1000*60*60*24*30) //mois
    if(duration<1){
      duration = (currentDate.getTime() - dates.getTime())/(1000*60*60*24*7) //semaine
      if(duration<1){
        duration = (currentDate.getTime() - dates.getTime())/(1000*60*60*24) //jour
        if(duration<1){
          duration = (currentDate.getTime() - dates.getTime())/(1000*60*60) //heure
          if(duration<1){
            duration = (currentDate.getTime() - dates.getTime())/(1000*60) //minute
            if(duration<1){
              duration = (currentDate.getTime() - dates.getTime())/(1000) //second
              return "second"
            }else{
              return Math.round(duration) + "minute"
            }
          }else{
            return Math.round(duration) + "heure"
          }
        }else{
          return Math.round(duration) + "jour"
        }
      }else{
        return Math.round(duration) + "semaine" 
      }
    }else if (duration>12){
      return 'null'
    } else{
      return Math.round(duration) + "mois"
    }

   
    

    
    
  }

  checkdate(date1:Date,date2:Date){
    let startdate=new Date(date1)
    let enddate=new Date(date1)
    let datecomapire=this.deletezonehour(new Date(date2))
    startdate.setSeconds(0)
    startdate.setMilliseconds(0)
    startdate.setHours(0)
    startdate.setMinutes(0)
    enddate.setSeconds(59)
    enddate.setMilliseconds(0)
    enddate.setHours(23)
    enddate.setMinutes(59)    
    if(datecomapire.getTime()>=startdate.getTime() && datecomapire.getTime()<=enddate.getTime()){
      return true
    }else{
      return false
    }
  }

  check2date(datedebut:Date,datefin:Date,createddate:Date){
    let startdate=new Date(datedebut)
    let enddate=new Date(datefin)
    let datecomapire=this.deletezonehour(new Date(createddate))
    startdate.setSeconds(0)
    startdate.setMilliseconds(0)
    startdate.setHours(0)
    startdate.setMinutes(0)
    enddate.setSeconds(59)
    enddate.setMilliseconds(0)
    enddate.setHours(23)
    enddate.setMinutes(59)    
    if(datecomapire.getTime()>=startdate.getTime() && datecomapire.getTime()<=enddate.getTime()){
      return true
    }else{
      return false
    }
  }
}
