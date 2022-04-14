import { RemiseRechagePartenaire } from './../../../model/RemiseRechagePartenaire';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TableCaisseEndPointService } from '../../../service/bp-api-pos/table-caisse-end-point/table-caisse-end-point.service';
import { GlobalServiceService } from '../../../service/GlobalService/global-service.service';
import { RemiseRechagePartenaireEndPointService } from '../../../service/bp-api-product/remise-rechage-partenaire-end-point/remise-rechage-partenaire-end-point.service';

@Component({
  selector: 'ngx-gestionremiserechage',
  templateUrl: './gestionremiserechage.component.html',
  styleUrls: ['./gestionremiserechage.component.scss']
})
export class GestionremiserechageComponent implements OnInit {

  
  constructor(private route:Router,private _TableCaisseEndPointService:TableCaisseEndPointService,
    private _RemiseRechagePartenaireEndPointService:RemiseRechagePartenaireEndPointService,
    private _GlobalService:GlobalServiceService) { }
  remises:RemiseRechagePartenaire[]=[]
  cols:any[]
  loading:boolean=true
  displyagent:boolean=false
  ngOnInit() {
    this.cols = [
      { field: 'Capacité de la Table', header: 'Capacité de la Table' },
      { field: 'Numéro de la Table', header: 'Numéro de la Table' },
      { field: 'Numéro de la Table', header: 'Numéro de la Table' },
      { field: 'Action', header: 'Action' },
  ];
    this._RemiseRechagePartenaireEndPointService.findAllRemiseByIdpartner(localStorage.getItem("partenaireid")).subscribe(val=>{
      this.loading=false
      console.log(val);
      
      if(val.result==1){
        this.remises=val.objectResponse
      }else{
        this.remises=[]
      }
    })
  }
  addtable(){
    this.route.navigateByUrl("/pages/Pointvente/gestionRemises/NouvelleRemise")
  }
  edittable(table:RemiseRechagePartenaire){
    this.route.navigateByUrl("/pages/Pointvente/gestionRemises/ModifierRemise/"+table.idRemiseRechagePartenaire)
  }
  currnetcient:RemiseRechagePartenaire=new RemiseRechagePartenaire()
deactive(agent:RemiseRechagePartenaire){
  this.currnetcient=agent
  if(this.currnetcient.isActif!=0){
  this.displyagent=true
  }else{
    this.activagent()
  }
}
  activagent(){
    // console.log(this.currnetcient);
    this.currnetcient.isActif=1
    this._RemiseRechagePartenaireEndPointService.CreateremiseRechagePartenaire(this.currnetcient).subscribe(val=>{
          if(val.result==1){
         this._GlobalService.showToast('success','succès',"la Remise a été activé avec succés")
         this.remises.forEach(ee=>{
           if(ee.idRemiseRechagePartenaire==this.currnetcient.idRemiseRechagePartenaire){
             ee.isActif=1
           }
         })
       }else{
         this._GlobalService.showToast('danger','Erreur',val.errorDescription)
       }
     },erreur=>{
       this._GlobalService.showToast('danger','Erreur',erreur)
       
     })
   }
  deleteagent(){
    this.currnetcient.isActif=0
    this._RemiseRechagePartenaireEndPointService.CreateremiseRechagePartenaire(this.currnetcient).subscribe(val=>{
          if(val.result==1){
         this._GlobalService.showToast('success','succès',"la Remise a été deactivé avec succés")
         this.remises.forEach(ee=>{
           if(ee.idRemiseRechagePartenaire==this.currnetcient.idRemiseRechagePartenaire){
             ee.isActif=0
           }
         })
       }else{
         this._GlobalService.showToast('danger','Erreur',val.errorDescription)
       }
     },erreur=>{
       this._GlobalService.showToast('danger','Erreur',erreur)
       
     })
   }
  

}
