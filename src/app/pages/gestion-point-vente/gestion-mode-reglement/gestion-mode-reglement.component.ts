import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PointVenteEndPointService } from '../../../service/bp-api-pos/point-vente-end-point/point-vente-end-point.service';
import { Router } from '@angular/router';
import { GlobalServiceService } from '../../../service/GlobalService/global-service.service';
import { ModeReglementEndPointService } from '../../../service/bp-api-pos/mode-reglement-end-point/mode-reglement-end-point.service';
import { ModeReglement } from '../../../model/ModeReglement';

@Component({
  selector: 'ngx-gestion-mode-reglement',
  templateUrl: './gestion-mode-reglement.component.html',
  styleUrls: ['./gestion-mode-reglement.component.scss']
})
export class GestionModeReglementComponent implements OnInit {
  constructor(private _PointVenteEndPointService:PointVenteEndPointService,private _ModeReglementEndPointService:ModeReglementEndPointService,
    private router:Router,private _GlobalService:GlobalServiceService) { }

  loading:boolean=true
  sortOptions: any[];

    sortKey: string;

    sortField: string;

    sortOrder: number;
  ngOnInit() {
    this.cols = [
      { field: 'Désignation', header: 'Désignation' },
      { field: 'Actif', header: 'Actif' },
      { field: 'Default', header: 'Default' },
      { field: 'Numero', header: 'Numéro' },
      { field: 'Fidelite', header: 'Fidelite' },
      { field: 'Date', header: 'Date' },
      { field: 'Validation', header: 'Validation' },
      { field: 'Action', header: 'Action' }

  ];
    this._ModeReglementEndPointService.findAllModeReglementByIdPointVente(localStorage.getItem('pointventeid')).subscribe(pv=>{
      if(pv.result==1){
        this.moderegs=pv.objectResponse
        console.log(this.moderegs);
        this.loading=false
      }else{
        this.loading=false
      }
    })
  

  }
 
moderegs:ModeReglement[]

cols: any[];

redirect(){
  this.router.navigateByUrl("/pages/Pointvente/gestionModeReglement/NouveauModeReglement")
}
currentmode:ModeReglement=new ModeReglement();
diplay:boolean=false
deletetable(mode:ModeReglement){
  this.currentmode=mode
  this.diplay=true
}

deletemode(){
  this.moderegs=this.moderegs.filter(val=>val.idModeReglement!=this.currentmode.idModeReglement);
  this._ModeReglementEndPointService.DeleteModeReglement(this.currentmode.idModeReglement).subscribe(val=>{
    console.log(val);
    if(val.result==1){
      this._GlobalService.showToast("success","success","la table a ete supprimé avec succès")
    }
  })
}
}
