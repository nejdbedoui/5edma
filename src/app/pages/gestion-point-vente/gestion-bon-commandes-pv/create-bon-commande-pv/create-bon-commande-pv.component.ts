import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BonCommande } from '../../../../model/BonCommande';
import { BonCommandePv } from '../../../../model/BonCommandePv';
import { CategorieDto } from '../../../../model/dto/CategorieDto';
import { PointVente } from '../../../../model/PointVente';
import { OnePointVenteResponse } from '../../../../model/response/OnePointVenteResponse';
import { BonCommandePvEndPointService } from '../../../../service/bp-api-pos/bon-commande-pv-end-poin/bon-commande-pv-end-point.service';
import { PointVenteEndPointService } from '../../../../service/bp-api-pos/point-vente-end-point/point-vente-end-point.service';
import { CategorieEndPointService } from '../../../../service/bp-api-product/categorie-end-point/categorie-end-point.service';
import { GlobalServiceService } from '../../../../service/GlobalService/global-service.service';

@Component({
  selector: 'ngx-create-bon-commande-pv',
  templateUrl: './create-bon-commande-pv.component.html',
  styleUrls: ['./create-bon-commande-pv.component.scss']
})
export class CreateBonCommandePvComponent implements OnInit {
  BonCommandePvForm: FormGroup;
  loading: boolean = false;
  isBonCommandePvFormSubmitted: boolean = false;
  isSubmitted: boolean;
  Categories:CategorieDto[];
  pointVente:PointVente ;
  constructor(private _FormBuilder: FormBuilder,private _CategorieEndPointService:CategorieEndPointService,private router:Router,private _GlobalServiceService:GlobalServiceService,private _bonCommandeService: BonCommandePvEndPointService,private _pointVenteService: PointVenteEndPointService) { }

  ngOnInit() {
    this.createForm();
    this.getAllCategorie();
    this.getPointVente();
  }

  getPointVente(){
    this._pointVenteService.findPointVenteByIdPointVente(localStorage.getItem("pointventeid")).subscribe(response=>{
      if (response.result==1){
    
        this.pointVente = response.objectResponse;

      }
    })
  }

  getAllCategorie(){
  this._CategorieEndPointService.listcategorieArticleForPointVente(localStorage.getItem("pointventeid")).subscribe(res => {
    console.log(res);
    if (res.result == 1){
      this.Categories = res.objectResponse;
    }
  });
}

  createForm() {
    this.BonCommandePvForm = this._FormBuilder.group({
      idCategorie: [null,[Validators.required]],
      type:[null,[Validators.required]],
      nomFournisseur:[null,[]]
    });

    this.BonCommandePvForm.get('type').valueChanges
  .subscribe(value => {
    if(value == 'Fournisseur') {
      this.BonCommandePvForm.get('nomFournisseur').setValidators(Validators.required);
    } else {
      this.BonCommandePvForm.get('nomFournisseur').setValidators(null);
    }
  });
  }

  createBonCommandePv(){
    this.isSubmitted=true;
    this.loading=false;
    if (this.BonCommandePvForm.invalid){
      return;
    } else{
      let bonCommandePv:BonCommandePv = new BonCommandePv();
      
      bonCommandePv.idPointVente=localStorage.getItem("pointventeid");
      bonCommandePv.idCategorie=this.BonCommandePvForm.value.idCategorie;
      bonCommandePv.type=this.BonCommandePvForm.value.type;
      if(bonCommandePv.type=='Centrale'){
        bonCommandePv.nomFournisseur=null;
      }
      else {
        bonCommandePv.nomFournisseur=this.BonCommandePvForm.value.nomFournisseur;
      }
      bonCommandePv.statut=0;
      bonCommandePv.date = new Date();
      bonCommandePv.nomCategorie = this.Categories.filter(val=>val.idCategorie==bonCommandePv.idCategorie)[0].designation;
      bonCommandePv.nomPointVente = this.pointVente.designation;

      this._bonCommandeService.createBonCommandePv(bonCommandePv).subscribe(response=>{
        console.log(bonCommandePv);
        if(response.result==1){
          this._GlobalServiceService.showToast('success','succès',"le categorie a été crée avec succès")
          this.loading=true
          this.router.navigateByUrl("/pages/Pointvente/gestionBonCommandePv");
        }
        else{
          this._GlobalServiceService.showToast('danger',"Erreur",response.errorDescription);
        }
        this.loading=false;
      });


    }
    
  }
  returntolist(){
    this.router.navigateByUrl("/pages/Pointvente/gestionBonCommandePv")
  }
}
