import { Component, OnInit } from '@angular/core';
import { GlobalServiceService } from '../../../service/GlobalService/global-service.service';
import { RegleUtilisationFidelite } from '../../../model/RegleUtilisationFidelite';
import { Router } from '@angular/router';
import { RegleUtilisationFideliteEndPointService } from '../../../service/bp-api-loyality/regle-utilisation-fidelite-end-point/regle-utilisation-fidelite-end-point.service';

@Component({
  selector: 'ngx-regle-utilisation',
  templateUrl: './regle-utilisation.component.html',
  styleUrls: ['./regle-utilisation.component.scss']
})
export class RegleUtilisationComponent implements OnInit {

  constructor(private route:Router,private _RegleUtilisationFideliteEndPointService:RegleUtilisationFideliteEndPointService,
    private _GlobalService:GlobalServiceService) { }
  regles:RegleUtilisationFidelite[]=[]
  cols:any[]
  loading:boolean=true
  diplayregle:boolean=false
  currentregle:RegleUtilisationFidelite=new RegleUtilisationFidelite()
  ngOnInit() {
    this.cols = [
      { field: 'Capacité de la Table', header: 'Capacité de la Table' },
      { field: 'Numéro de la Table', header: 'Numéro de la Table' },
      { field: 'Action', header: 'Action' },
  ];
    this._RegleUtilisationFideliteEndPointService.findAllRegleUtilisationByIdPointVente(localStorage.getItem("pointventeid")).subscribe(val=>{
      this.loading=false
      console.log(val);
      
      if(val.result==1){
        this.regles=val.objectResponse
      }
    })
  }
  addtable(){
    this.route.navigateByUrl("/pages/Pointvente/RegleUtilisation/NouvelleRegle")
  }
  edittable(regle:RegleUtilisationFidelite){
    this.route.navigateByUrl("/pages/Pointvente/RegleUtilisation/ModifierRegle/"+regle.idRegleUtilisationFidelite)
  }
  deletetable(regle:RegleUtilisationFidelite){
  this.currentregle=regle
  this.diplayregle=true
    
  }
  deleteregle(){
  this.regles=this.regles.filter(val=>val.idRegleUtilisationFidelite!=this.currentregle.idRegleUtilisationFidelite);
      this._RegleUtilisationFideliteEndPointService.DeleteRegleUtilisationFidelite(this.currentregle.idRegleUtilisationFidelite).subscribe(val=>{
        console.log(val);
        if(val.result==1){
          this.diplayregle=false
          this._GlobalService.showToast("success","success","la regle d'utilisation a ete supprimé avec succès")
        }else{
          this.diplayregle=false
          this._GlobalService.showToast("danger","Erreur",val.errorDescription)

        }
      },erreur=>{
        this._GlobalService.showToast("danger","Erreur","erreur")

      })
    }

}
