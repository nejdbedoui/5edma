import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PointVenteEndPointService } from '../../../../service/bp-api-pos/point-vente-end-point/point-vente-end-point.service';
import { Router, ActivatedRoute } from '@angular/router';
import { GlobalServiceService } from '../../../../service/GlobalService/global-service.service';
import { ModeReglementEndPointService } from '../../../../service/bp-api-pos/mode-reglement-end-point/mode-reglement-end-point.service';
import { ModeReglement } from '../../../../model/ModeReglement';

@Component({
  selector: 'ngx-update-mode-reglement',
  templateUrl: './update-mode-reglement.component.html',
  styleUrls: ['./update-mode-reglement.component.scss']
})
export class UpdateModeReglementComponent implements OnInit {

  constructor(private _FormBuilder:FormBuilder,
    private _PointVenteEndPointService:PointVenteEndPointService,private router:Router,private _GlobalServiceService:GlobalServiceService,
    private _ModeReglementEndPointService:ModeReglementEndPointService,private route:ActivatedRoute) { }
    modeForm:FormGroup;
loading:boolean=false
istableFormSubmitted:boolean=false
moderegelement:ModeReglement=new ModeReglement()
id:string = this.route.snapshot.paramMap.get('id');

  ngOnInit() {
    this.modeForm=this._FormBuilder.group({
      designation:['',[Validators.required]],
      ffidelite:[false],
      fnum:[false],
      fvalidation:[false],
      fdate:[false],
      fdefault:[false],
      isactif:[true]
    })
    this._ModeReglementEndPointService.findByIdModeReglement(this.id).subscribe(val=>{
      this.modeForm=this._FormBuilder.group({
        designation:[val.objectResponse.designation,[Validators.required]],
        ffidelite:[val.objectResponse.ffidelite==1],
        fnum:[val.objectResponse.fnum==1],
        fvalidation:[val.objectResponse.fvalidation==1],
        fdate:[val.objectResponse.fdate==1],
        fdefault:[val.objectResponse.fdefault==1],
        isactif:[val.objectResponse.isactif==1]
      })
      this.color=val.objectResponse.couleur
    })
  }

  createmode(){
    this.istableFormSubmitted=true
    this.loading=true
    if(this.modeForm.invalid){
      return
    }else{
      this.moderegelement.idModeReglement=this.id
      this.moderegelement.designation=this.modeForm.value.designation
      this.moderegelement.code= this.modeForm.value.designation.toUpperCase()
      this.moderegelement.fdate=this.modeForm.value.fdate?1:0
      this.moderegelement.fdefault=this.modeForm.value.fdefault?1:0
      this.moderegelement.ffidelite=this.modeForm.value.ffidelite?1:0
      this.moderegelement.fnum=this.modeForm.value.fnum?1:0
      this.moderegelement.isactif=this.modeForm.value.isactif?1:0
      this.moderegelement.fvalidation=this.modeForm.value.fvalidation?1:0
      this.moderegelement.idPointVente=localStorage.getItem("pointventeid")
      this.moderegelement.couleur=this.color
      console.log( this.moderegelement);
      
      this._ModeReglementEndPointService.UpdateModeReglement( this.moderegelement).subscribe(val=>{
        this.loading=false
        console.log(val);
        
        if(val.result==1){
          this.router.navigateByUrl("/pages/Pointvente/gestionModeReglement")
        }else{
          this._GlobalServiceService.showToast('danger','Erreur',val.errorDescription)
        }
      },erreur=>{
        this._GlobalServiceService.showToast('danger','Erreur',erreur)

      })
    }
  }
  get formControls() { return this.modeForm.controls; }

returntolist(){
  this.router.navigateByUrl("/pages/Pointvente/gestionModeReglement")
}

public color: string;
onEventLog(evnt,evnt2){
  this.color=evnt2.color
}

}
