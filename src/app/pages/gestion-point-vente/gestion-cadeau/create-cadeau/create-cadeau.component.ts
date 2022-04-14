import { Component, OnInit } from '@angular/core';
import { CadeauEndPointService } from '../../../../service/bp-api-product/cadeau-end-point/cadeau-end-point.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GlobalServiceService } from '../../../../service/GlobalService/global-service.service';
import { Cadeau } from '../../../../model/Cadeau';

@Component({
  selector: 'ngx-create-cadeau',
  templateUrl: './create-cadeau.component.html',
  styleUrls: ['./create-cadeau.component.scss']
})
export class CreateCadeauComponent implements OnInit {

  constructor(private _CadeauEndPointService:CadeauEndPointService,private _FormBuilder:FormBuilder,
  private router:Router,private _GlobalServiceService:GlobalServiceService) { }
cadeauForm:FormGroup;
loading:boolean=false
isFormSubmitted:boolean=false;
Types=[{label:'Bienvenue',value:'Bienvenue'},{label:'Anniversaire',value:'Anniversaire'}];
public calendar: any;
    calendar_fr = {
      closeText: "Fermer",
      prevText: "Précédent",
      nextText: "Suivant",
      currentText: "Aujourd'hui",
      monthNames: [ "janvier", "février", "mars", "avril", "mai", "juin",
        "juillet", "août", "septembre", "octobre", "novembre", "décembre" ],
      monthNamesShort: [ "janv.", "févr.", "mars", "avr.", "mai", "juin",
        "juil.", "août", "sept.", "oct.", "nov.", "déc." ],
      dayNames: [ "dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi" ],
      dayNamesShort: [ "dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam." ],
      dayNamesMin: [ "D","L","M","M","J","V","S" ],
      weekHeader: "Sem.",
      dateFormat: "dd-mm-yy",
      firstDay: 1,
      isRTL: false,
      showMonthAfterYear: false,
      yearSuffix: ""
    };
  ngOnInit() {
    this.calendar=this.calendar_fr;
    this.cadeauForm=this._FormBuilder.group({
      datedebut:[''],
      datefin:[''],
      type: ['',[Validators.required]],
      valeur: ['',[Validators.required]],
      fActif:[false]
    })
  }

  addcadeau(){
    this.isFormSubmitted=true
    if(this.cadeauForm.invalid){
      return
    }else{
      this.loading=true
      console.log(this.cadeauForm.value);
      let cadeau:Cadeau=new Cadeau();
      cadeau.datedebut=this.cadeauForm.value.datedebut
      cadeau.datefin=this.cadeauForm.value.datefin
      cadeau.type=this.cadeauForm.value.type
      cadeau.valeur=this.cadeauForm.value.valeur
      cadeau.fActif=this.cadeauForm.value.fActif?1:0
      cadeau.idpartneraire=localStorage.getItem("partenaireid")
      this._CadeauEndPointService.CreateCadeau(cadeau).subscribe(val=>{
        this.loading=false
        console.log(val);
        
        if(val.result==1){
          this.router.navigateByUrl("/pages/Pointvente/gestionCadeau")
        }else{
          this._GlobalServiceService.showToast('danger','Erreur',val.errorDescription)
        }
      },erreur=>{
        this._GlobalServiceService.showToast('danger','Erreur',erreur)

      })
    }
  }
  get formControls() { return this.cadeauForm.controls; }

returntolist(){
  this.router.navigateByUrl("/pages/Pointvente/gestionCadeau")
}
}

