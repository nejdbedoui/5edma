import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalServiceService } from '../../../service/GlobalService/global-service.service';
import { Ingredient } from '../../../model/Ingredient';
import { ProductEndPointService } from '../../../service/bp-api-product/product-end-point/product-end-point.service';

@Component({
  selector: 'ngx-gestion-ingredient',
  templateUrl: './gestion-ingredient.component.html',
  styleUrls: ['./gestion-ingredient.component.scss']
})
export class GestionIngredientComponent implements OnInit {

  
  constructor(private route:Router,
    private _GlobalService:GlobalServiceService,private _ProductEndPointService:ProductEndPointService) { }
  ingredients:Ingredient[]=[]
  cols:any[]
  loading:boolean=true;
  selectedIngredient:Ingredient;
  diplayIngeredient: boolean =false;
  ngOnInit() {
    this.cols = [
      { field: 'couleur', header: 'Couleur' },
      { field: 'designation', header: 'Désignation' },
      { field: 'Action', header: 'Action' },
  ];
  this.getingredients();
  }
  getingredients(){
    this._ProductEndPointService.findAllIngredientByPartenaire(localStorage.getItem("partenaireid")).subscribe(val=>{
      if(val.result==1){
        this.ingredients=val.objectResponse
      }
      this.loading=false;
    })
  }
  addIngredient(){
    this.route.navigateByUrl("/pages/Pointvente/gestionIngredient/NouveauIngredient")
  }
  editIngredient(ingredient:Ingredient){
    this.route.navigateByUrl("/pages/Pointvente/gestionIngredient/ModifierIngredient/"+ingredient.idIngredient)
  }
  deleteIngredient(ingredient:any){
    this.selectedIngredient = ingredient;
    this.diplayIngeredient = true;

  }

  delete(){
    this.ingredients=this.ingredients.filter(val=>val.idIngredient!=this.selectedIngredient.idIngredient);
    this._ProductEndPointService.DeleteIngredient(this.selectedIngredient.idIngredient).subscribe(val=>{
      console.log(val);
      if(val.result==1){
        this._GlobalService.showToast("success","success","la table a ete supprimé avec succès")
      }
    })
  }

}
