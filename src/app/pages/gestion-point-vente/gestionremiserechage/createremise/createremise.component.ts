import { Component, OnInit } from '@angular/core';
import { TableCaisseEndPointService } from '../../../../service/bp-api-pos/table-caisse-end-point/table-caisse-end-point.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PointVenteEndPointService } from '../../../../service/bp-api-pos/point-vente-end-point/point-vente-end-point.service';
import { Router } from '@angular/router';
import { GlobalServiceService } from '../../../../service/GlobalService/global-service.service';
import { PointVente } from '../../../../model/PointVente';
import { RemiseRechagePartenaire } from '../../../../model/RemiseRechagePartenaire';
import { RemiseRechagePartenaireEndPointService } from '../../../../service/bp-api-product/remise-rechage-partenaire-end-point/remise-rechage-partenaire-end-point.service';

@Component({
  selector: 'ngx-createremise',
  templateUrl: './createremise.component.html',
  styleUrls: ['./createremise.component.scss']
})
export class CreateremiseComponent implements OnInit {

 
  
  constructor(private _TableCaisseEndPointService:TableCaisseEndPointService,private _FormBuilder:FormBuilder,
    private _PointVenteEndPointService:PointVenteEndPointService,private router:Router,
    private _GlobalServiceService:GlobalServiceService,
    private _RemiseRechagePartenaireEndPointService:RemiseRechagePartenaireEndPointService) { }
    remiseForm:FormGroup;
points:PointVente[]=[]
loading:boolean=false
isSubmitted:boolean=false
Types=[{label:'Carrée',value:'Carrée'},{label:'Rectangulaire',value:'Rectangulaire'},{label:'Circulaire',value:'Circulaire'}];

  ngOnInit() {
    this.remiseForm=this._FormBuilder.group({
      min:['',[Validators.required]],
      max:['',[Validators.required]],
      remise: ['',[Validators.required]]
    })
  }

  addremise(){
    this.isSubmitted=true
    if(this.remiseForm.invalid){
      return
    }else{
      this.loading=true
      let remise:RemiseRechagePartenaire=new RemiseRechagePartenaire()
      remise.dateCreation=new Date()
      remise.idPartenaire=localStorage.getItem("partenaireid")
      remise.isActif=1
      remise.max=this.remiseForm.value.max
      remise.min=this.remiseForm.value.min
      remise.valeurRemise=this.remiseForm.value.remise
      this._RemiseRechagePartenaireEndPointService.CreateremiseRechagePartenaire(remise).subscribe(val=>{
        this.loading=false
        if(val.result==1){
          this._GlobalServiceService.showToast('success','success','la remise a été crée avec succès')
          this.router.navigateByUrl("/pages/Pointvente/gestionRemises")
        }else{
          this._GlobalServiceService.showToast('danger','Erreur',val.errorDescription)
        }
      },erreur=>{
        this._GlobalServiceService.showToast('danger','Erreur',erreur)

      })
      

    }
  }
  get formControls() { return this.remiseForm.controls; }

returntolist(){
  this.router.navigateByUrl("/pages/Pointvente/gestionRemises")
}
}
