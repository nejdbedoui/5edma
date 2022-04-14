import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Ingredient } from '../../../../model/Ingredient';
import { Prodcut } from '../../../../model/Product';
import { ProductEndPointService } from '../../../../service/bp-api-product/product-end-point/product-end-point.service';
import { GlobalServiceService } from '../../../../service/GlobalService/global-service.service';

@Component({
  selector: 'ngx-update-ingredient',
  templateUrl: './update-ingredient.component.html',
  styleUrls: ['./update-ingredient.component.scss']
})
export class UpdateIngredientComponent implements OnInit {

  constructor(private _FormBuilder:FormBuilder,private router:Router,
    private _GlobalServiceService:GlobalServiceService,private _ProductEndPointService:ProductEndPointService,
    private route: ActivatedRoute) { }
tableForm:FormGroup;
loading:boolean=false
istableFormSubmitted:boolean=false
public color: string;
id:string = this.route.snapshot.paramMap.get('id');
products:Prodcut[] =[];
selectedProduct:String;
ingredient: Ingredient = new Ingredient();
  ngOnInit() {
    this.setForm();
    this.getProducts();
    
  }

  setForm(ingredient?: Ingredient){
    this.tableForm=this._FormBuilder.group({
      designation:[ingredient!=null?ingredient.designation:null,[Validators.required]],
      isComps:[ingredient!=null?ingredient.isComps?1:0:null],
      idProduit:[ingredient!=null?ingredient.idProduit:null],
      qte:[ingredient!=null?ingredient.qte:null]
    })
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
      ingredient.idIngredient = this.ingredient.idIngredient;
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
      this.products = val.objectResponse? val.objectResponse : [];
      this.findIngredientByIdIngredient();
    })
  }

  selectEvent(item: Prodcut){
    console.log(item);
    this.tableForm.controls['idProduit'].setValue(item.idProduit)
  }

  onEventLog(evnt,evnt2){
    this.color=evnt2.color
  }

  findIngredientByIdIngredient(){
    this._ProductEndPointService.findIngredientByIdIngredient(this.id).subscribe(val=>{
        this.ingredient = val.objectResponse;
        this.color = this.ingredient.couleur;
        this.selectedProduct = this.products.find(el=>el.idProduit == this.ingredient.idProduit).designation
        this.setForm(this.ingredient);
    })
  }

}
