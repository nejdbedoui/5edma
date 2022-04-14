import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PointVenteEndPointService } from '../../../../service/bp-api-pos/point-vente-end-point/point-vente-end-point.service';
import { Router } from '@angular/router';
import { GlobalServiceService } from '../../../../service/GlobalService/global-service.service';
import { ProductEndPointService } from '../../../../service/bp-api-product/product-end-point/product-end-point.service';
import { Ingredient } from '../../../../model/Ingredient';
import { Prodcut } from '../../../../model/Product';

@Component({
  selector: 'ngx-create-ingredient',
  templateUrl: './create-ingredient.component.html',
  styleUrls: ['./create-ingredient.component.scss']
})
export class CreateIngredientComponent implements OnInit {

  constructor(private _FormBuilder:FormBuilder,private router:Router,
    private _GlobalServiceService:GlobalServiceService,private _ProductEndPointService:ProductEndPointService) { }
tableForm:FormGroup;
loading:boolean=false
istableFormSubmitted:boolean=false
public color: string;
products:Prodcut[] =[];

  ngOnInit() {
    this.tableForm=this._FormBuilder.group({
      designation:['',[Validators.required]],
      isComps:[false],
      idProduit:[],
      qte:[]
    })
    this.getProducts();
  }

  addIngredient(){
    this.istableFormSubmitted=true
    this.loading = true
    console.log(this.tableForm.value.isComps && (this.tableForm.value.idProduit == null || this.tableForm.value.qte ==null));
    console.log(this.tableForm.value.idProduit == null );
    console.log(this.tableForm.value.qte==null);
    
    
    
    if(this.tableForm.invalid || (this.tableForm.value.isComps && (this.tableForm.value.idProduit == null || this.tableForm.value.qte == null))){
      this.loading = false
      return
    }else{
      let ingredient:Ingredient = new Ingredient();
      ingredient=this.tableForm.value;
      ingredient.couleur=this.color;
      ingredient.isComps = this.tableForm.value.isComps ? 1:0;
      ingredient.idPartenaire=localStorage.getItem("partenaireid");
      this._ProductEndPointService.createIngredient(ingredient).subscribe(val=>{
        if(val.result==1){
          this.router.navigateByUrl("/pages/Pointvente/gestionIngredient")
        }else{
          this._GlobalServiceService.showToast('danger','Erreur',val.errorDescription)
          this.loading=false;
        }
      },erreur=>{
        this._GlobalServiceService.showToast('danger','Erreur',erreur);
        this.loading=false;

      })

    }
  }
  get formControls() { return this.tableForm.controls; }

returntolist(){
  this.router.navigateByUrl("/pages/Pointvente/gestionIngredient")
}

getProducts(){
  this._ProductEndPointService.findAllByPartenaire(localStorage.getItem("partenaireid")).subscribe(val=>{
    this.products = val.objectResponse? val.objectResponse : []
  })
}
selectEvent(item: Prodcut){
  console.log(item);
  this.tableForm.controls['idProduit'].setValue(item.idProduit)
}

  onEventLog(evnt,evnt2){
    this.color=evnt2.color
  }

}
