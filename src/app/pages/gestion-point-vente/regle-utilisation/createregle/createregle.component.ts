import { RegleUtilisationFidelite } from './../../../../model/RegleUtilisationFidelite';
import { Component, OnInit } from '@angular/core';
import { GlobalServiceService } from '../../../../service/GlobalService/global-service.service';
import { RegleUtilisationFideliteEndPointService } from '../../../../service/bp-api-loyality/regle-utilisation-fidelite-end-point/regle-utilisation-fidelite-end-point.service';
import { JoursRegle } from '../../../../model/JoursRegle';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-createregle',
  templateUrl: './createregle.component.html',
  styleUrls: ['./createregle.component.scss']
})
export class CreateregleComponent implements OnInit {

  
  constructor(private _GlobalService:GlobalServiceService,private _RegleUtilisationFideliteEndPointService:RegleUtilisationFideliteEndPointService,
    private router:Router,private _GlobalServiceService:GlobalServiceService) { }
  displaytable:boolean=false
  activer:boolean=false
  allweek:boolean=true
  solde:number;
  nbr:number;
  listday:any[]
  loading:boolean=false
  ngOnInit() {
    this.listday = [
      { day: 'Lundi', code: 'M',Activer:false,startday:null,endday:null },
      { day: 'Mardi', code: 'T',Activer:false,startday:null,endday:null },
      { day: 'Mercredi', code: 'W',Activer:false,startday:null,endday:null },
      { day: 'jeudi', code: 'TH',Activer:false,startday:null,endday:null },
      { day: 'Vendredi', code: 'F',Activer:false,startday:null,endday:null },
      { day: 'Samedi', code: 'SA',Activer:false,startday:null,endday:null },
      { day: 'Dimanche', code: 'SU',Activer:false,startday:null,endday:null },

      
  ];
  }

  saveregle(){
    this.loading=true
    if(!this.allweek){
      let list:any[]=this.listday.filter(val=>val.Activer)
      let erruer:boolean=false
      list.forEach(element => {
        if((element.endday!=null && element.endday!='') && (element.startday!=null && element.startday!='')){
          if(new Date(element.endday).getTime()< new Date(element.startday).getTime()){
            erruer=true
          }
        }
      });
      if(erruer){
        this.loading=false
        this._GlobalService.showToast('danger','Erreur',"Veuillez verifier les dates ")
      }else{
        let regle:RegleUtilisationFidelite=new RegleUtilisationFidelite();
        regle.joursUtilisation=[]
        
        list.forEach(val=>{
          let joursRegle:JoursRegle=new JoursRegle()
          joursRegle.code=val.code
          if(this.verifdate(val.startday)=='00:00' && this.verifdate(val.endday)=='00:00'){
            joursRegle.debut=this.verifdate(val.startday)
            joursRegle.fin='23:59'
            joursRegle.fAllDay=1
          }else{
            
            joursRegle.debut=this.verifdate(val.startday)
            joursRegle.fin=this.verifdate(val.endday)=='00:00'?'23:59':this.verifdate(val.endday)
            joursRegle.fAllDay=0
          }
          joursRegle.designation=val.day
          regle.joursUtilisation.push(joursRegle)
        })
        regle.idPointVente=localStorage.getItem("pointventeid")
        regle.minPresent=this.nbr
        regle.minSolde=this.solde
        regle.isActive=1
        console.log(regle);
        this._RegleUtilisationFideliteEndPointService.CreateRegleUtilisationFidelite(regle).subscribe(res=>{
          if(res.result==1){
            this.loading=false
            this.router.navigateByUrl("pages/Pointvente/RegleUtilisation");
          }else{
            this.loading=false
            this._GlobalServiceService.showToast('danger','Erreur',res.errorDescription);
          }
        },erruer=>{
          this.loading=false
          this._GlobalServiceService.showToast('danger','Erreur',erruer);
        })
      }
    }else{
      let regle:RegleUtilisationFidelite=new RegleUtilisationFidelite();
      regle.joursUtilisation=[]
      regle.idPointVente=localStorage.getItem("pointventeid")
      regle.minPresent=this.nbr
      regle.minSolde=this.solde
      regle.isActive=1
      this.loading=false
      this._RegleUtilisationFideliteEndPointService.CreateRegleUtilisationFidelite(regle).subscribe(res=>{
        if(res.result==1){
          this.loading=false
          this.router.navigateByUrl("pages/Pointvente/RegleUtilisation");
        }else{
          this.loading=false
          this._GlobalServiceService.showToast('danger','Erreur',res.errorDescription);
        }
      },erruer=>{
        this.loading=false
        this._GlobalServiceService.showToast('danger','Erreur',erruer);
      })
    }
    
  }

  verifdate(time){    
    if(time==null){
      return '00:00';
    }else{
      let h:string=time.getHours()
      let m:string=time.getMinutes()
      if(time.getHours()<10){
        h='0'+time.getHours()
      }
      if(time.getMinutes() <10){
        m='0'+time.getMinutes()
      }
      return h+":"+m
    }
  }

}
