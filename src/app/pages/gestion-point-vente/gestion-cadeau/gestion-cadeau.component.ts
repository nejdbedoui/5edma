import { Component, OnInit } from '@angular/core';
import { CadeauEndPointService } from '../../../service/bp-api-product/cadeau-end-point/cadeau-end-point.service';
import { Cadeau } from '../../../model/Cadeau';
import { Router } from '@angular/router';
import { GlobalServiceService } from '../../../service/GlobalService/global-service.service';
import { TableCaisse } from '../../../model/TableCaisse';

@Component({
  selector: 'ngx-gestion-cadeau',
  templateUrl: './gestion-cadeau.component.html',
  styleUrls: ['./gestion-cadeau.component.scss']
})
export class GestionCadeauComponent implements OnInit {

  constructor(private route:Router,private _CadeauEndPointService:CadeauEndPointService,
    private _GlobalService:GlobalServiceService) { }
  cadeaus:Cadeau[]=[]
  cols:any[]
  loading:boolean=true
  ngOnInit() {
    this.cols = [
      { field: 'type', header: 'type' },
      { field: 'valeur', header: 'valeur' },
      { field: 'datedebut', header: 'datedebut' },
      { field: 'datefin', header: 'datefin' },
      { field: 'fActif', header: 'fActif' },
      { field: 'Action', header: 'Action' },
  ];
    this._CadeauEndPointService.findByIdpartenaire(localStorage.getItem("partenaireid")).subscribe(val=>{
      this.loading=false
      if(val.result==1){
        this.cadeaus=val.objectResponse
      }
    })
  }

  
  currentcadeau:Cadeau=new Cadeau()
  diplaycadeau:boolean=false
deletes(cadeau:Cadeau){
this.currentcadeau=cadeau
this.diplaycadeau=true
  
}

  addtable(){
    this.route.navigateByUrl("/pages/Pointvente/gestionCadeau/NouveauCadeau")
  }
  edittable(cadeau:Cadeau){
    this.route.navigateByUrl("/pages/Pointvente/gestionCadeau/updateCadeau/"+cadeau.id)
  }
  deletetable(){

    this.cadeaus=this.cadeaus.filter(val=>val.id!=this.currentcadeau.id);
    this._CadeauEndPointService.DeleteCadeau(this.currentcadeau.id).subscribe(val=>{
      console.log(val);
      if(val.result==1){
        this._GlobalService.showToast("success","success","le cadeau a été supprimé avec succès")
      }
    })
  }

}
