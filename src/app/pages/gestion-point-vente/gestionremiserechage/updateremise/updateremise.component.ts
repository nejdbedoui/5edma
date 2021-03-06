import { Component, OnInit } from '@angular/core';
import { RemiseRechagePartenaire } from '../../../../model/RemiseRechagePartenaire';
import { TableCaisseEndPointService } from '../../../../service/bp-api-pos/table-caisse-end-point/table-caisse-end-point.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PointVenteEndPointService } from '../../../../service/bp-api-pos/point-vente-end-point/point-vente-end-point.service';
import { Router, ActivatedRoute } from '@angular/router';
import { GlobalServiceService } from '../../../../service/GlobalService/global-service.service';
import { RemiseRechagePartenaireEndPointService } from '../../../../service/bp-api-product/remise-rechage-partenaire-end-point/remise-rechage-partenaire-end-point.service';
import { PointVente } from '../../../../model/PointVente';

@Component({
  selector: 'ngx-updateremise',
  templateUrl: './updateremise.component.html',
  styleUrls: ['./updateremise.component.scss']
})
export class UpdateremiseComponent implements OnInit {

 
  
  constructor(private _TableCaisseEndPointService:TableCaisseEndPointService,private _FormBuilder:FormBuilder,
    private _PointVenteEndPointService:PointVenteEndPointService,private router:Router,
    private _GlobalServiceService:GlobalServiceService,
    private _RemiseRechagePartenaireEndPointService:RemiseRechagePartenaireEndPointService,
    private route:ActivatedRoute) { }
    remiseForm:FormGroup;
points:PointVente[]=[]
loading:boolean=false
isSubmitted:boolean=false
id:string = this.route.snapshot.paramMap.get('id');

  ngOnInit() {
    this.remiseForm=this._FormBuilder.group({
      min:['',[Validators.required]],
      max:['',[Validators.required]],
      remise: ['',[Validators.required]]
    })
    this._RemiseRechagePartenaireEndPointService.findByIdremiseRechagePartenaire(this.id).subscribe(val=>{
      this.remiseForm=this._FormBuilder.group({
        min:[val.objectResponse.min,[Validators.required]],
        max:[val.objectResponse.max,[Validators.required]],
        remise: [val.objectResponse.valeurRemise,[Validators.required]]
      })
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
      remise.idRemiseRechagePartenaire=this.id
      this._RemiseRechagePartenaireEndPointService.CreateremiseRechagePartenaire(remise).subscribe(val=>{
        this.loading=false
        if(val.result==1){
          this._GlobalServiceService.showToast('success','success','la remise a ??t?? cr??e avec succ??s')
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

