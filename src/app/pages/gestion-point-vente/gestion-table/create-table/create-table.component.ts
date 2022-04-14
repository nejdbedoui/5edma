import { Component, OnInit } from '@angular/core';
import { TableCaisseEndPointService } from '../../../../service/bp-api-pos/table-caisse-end-point/table-caisse-end-point.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PointVenteEndPointService } from '../../../../service/bp-api-pos/point-vente-end-point/point-vente-end-point.service';
import { PointVente } from '../../../../model/PointVente';
import { Router } from '@angular/router';
import { GlobalServiceService } from '../../../../service/GlobalService/global-service.service';

@Component({
  selector: 'ngx-create-table',
  templateUrl: './create-table.component.html',
  styleUrls: ['./create-table.component.scss']
})
export class CreateTableComponent implements OnInit {

  constructor(private _TableCaisseEndPointService:TableCaisseEndPointService,private _FormBuilder:FormBuilder,
    private _PointVenteEndPointService:PointVenteEndPointService,private router:Router,private _GlobalServiceService:GlobalServiceService) { }
tableForm:FormGroup;
points:PointVente[]=[]
loading:boolean=false
istableFormSubmitted:boolean=false
Types=[{label:'Carrée',value:'Carrée'},{label:'Rectangulaire',value:'Rectangulaire'},{label:'Circulaire',value:'Circulaire'}];

  ngOnInit() {
    this.tableForm=this._FormBuilder.group({
      idPointVente:[localStorage.getItem("pointventeid")],
      numTable:['',[Validators.required]],
      capaciteTable:['',[Validators.required]],
      typeTable: [],
      description: [],
      etat:["libre"]
    })
    this._PointVenteEndPointService.findAllByIdPartenaireBprice(localStorage.getItem("partenaireid")).subscribe(val=>{
      if(val.result==1){
        this.points=val.objectResponse
      }
    })
  }

  addtable(){
    this.istableFormSubmitted=true
    this.loading=true
    if(this.tableForm.invalid){
      return
    }else{
      this._TableCaisseEndPointService.CreateTableCaisse(this.tableForm.value).subscribe(val=>{
        this.loading=false
        console.log(val);
        
        if(val.result==1){
          this.router.navigateByUrl("/pages/Pointvente/gestionTable")
        }else{
          this._GlobalServiceService.showToast('danger','Erreur',val.errorDescription)
        }
      },erreur=>{
        this._GlobalServiceService.showToast('danger','Erreur',erreur)

      })
    }
  }
  get formControls() { return this.tableForm.controls; }

returntolist(){
  this.router.navigateByUrl("/pages/Pointvente/gestionTable")
}
}
