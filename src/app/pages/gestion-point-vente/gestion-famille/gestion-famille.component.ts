import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalServiceService } from '../../../service/GlobalService/global-service.service';
import { ProductEndPointService } from '../../../service/bp-api-product/product-end-point/product-end-point.service';
import { Famille } from '../../../model/Famille';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'ngx-gestion-famille',
  templateUrl: './gestion-famille.component.html',
  styleUrls: ['./gestion-famille.component.scss']
})
export class GestionFamilleComponent implements OnInit {

  constructor(private _FormBuilder:FormBuilder,private route:Router,
    private _GlobalService:GlobalServiceService,private _ProductEndPointService:ProductEndPointService) { }
  familles:Famille[]=[]
  cols:any[]
  loading:boolean=true
  diplay:boolean= false;
  familleForm:FormGroup;
  isFamilleFormSubmitted:boolean = false;
  diplayCreation:boolean = false;
  selectedFamille:Famille
  ngOnInit() {
    this.cols = [
      { field: 'designation', header: 'Désignation' },
      { field: 'Action', header: 'Action' },
  ];
  this.getFamilles();
  this.createForm();
  }
  getFamilles(){
    this._ProductEndPointService.findAllFamilleByPartenaire(localStorage.getItem("partenaireid")).subscribe(val=>{
      if(val.result==1){
        this.familles=val.objectResponse
      }
      this.loading=false;
    })
  }
  addFamille(){
    this.isFamilleFormSubmitted=true
    this.loading=true
    if(this.familleForm.invalid){
      return
    }else{
      let famille:Famille = new Famille();
      famille=this.familleForm.value;
      famille.idPartenaire=localStorage.getItem("partenaireid");
      this._ProductEndPointService.createFamille(famille).subscribe(val=>{
        if(val.result==1){
          this.diplayCreation=false;
          if(this.selectedFamille)
            this.familles=this.familles.filter(val=>val.idFamille!=this.selectedFamille.idFamille);
          this.familles.push(val.objectResponse)
          this.loading=false;
          this.familleForm.reset()
          this.selectedFamille=null
          this.isFamilleFormSubmitted=false
        }else{
          this._GlobalService.showToast('danger','Erreur',val.errorDescription)
          this.loading=false;
          
        }
      },erreur=>{
        this._GlobalService.showToast('danger','Erreur',erreur);
        this.loading=false;

      })

    }
  }
  editFamille(famille:Famille){
    this.isFamilleFormSubmitted=false
    this.loading=false
    this.createForm(famille)
    this.diplayCreation=true;
    this.selectedFamille=famille
  }
  deleteFamille(famille:Famille){
console.log(this.selectedFamille);

    this.familles=this.familles.filter(val=>val.idFamille!=this.selectedFamille.idFamille);
    this._ProductEndPointService.DeleteFamille(this.selectedFamille.idFamille).subscribe(val=>{
      console.log(val);
      if(val.result==1){
        this._GlobalService.showToast("success","success","la famille a ete supprimé avec succès")
      }
    })
  }

  get formControls() { return this.familleForm.controls; }

  createForm(famille?:Famille){
    this.familleForm=this._FormBuilder.group({
      designation:[famille?famille.designation:'',[Validators.required]],
      idFamille:[famille?famille.idFamille:null]
    })
  }

  returntolist(){
    this.diplayCreation=false;
  }

}
