import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { PointVenteEndPointService } from '../../../service/bp-api-pos/point-vente-end-point/point-vente-end-point.service';
import { CategorieEndPointService } from '../../../service/bp-api-product/categorie-end-point/categorie-end-point.service';
import { Router } from '@angular/router';
import { ProductEndPointService } from '../../../service/bp-api-product/product-end-point/product-end-point.service';
import { CategorieDto } from '../../../model/dto/CategorieDto';
import { ListCategorieDto } from '../../../model/dto/ListCategorieDto';
import { GlobalServiceService } from '../../../service/GlobalService/global-service.service';

@Component({
  selector: 'ngx-categorie-possition',
  templateUrl: './categorie-possition.component.html',
  styleUrls: ['./categorie-possition.component.scss']
})
export class CategoriePossitionComponent implements OnInit {

  constructor(private _PointVenteEndPointService:PointVenteEndPointService,private _CategorieEndPointService:CategorieEndPointService,
    private router:Router,private _ProductEndPointService:ProductEndPointService,private _GlobalServiceService:GlobalServiceService) { }
    loading:boolean=true
    sortOptions: any[];
  
      sortKey: string;
  
      sortField: string;
      idpointVente=localStorage.getItem("pointventeid")
      sortOrder: number;
      diplay:boolean=false;
      categoriedtos:CategorieDto[]=[]
      categorieddtosnotselected:CategorieDto[]=[]
      categorieddtosoldselected:CategorieDto[]=[]
  ngOnInit() {
    this._CategorieEndPointService.findAllCategorieByIdpartenaire(localStorage.getItem("partenaireid")).subscribe(pv=>{
      console.log(pv);
      
      if(pv.result==1){
        

        this.availableCars=pv.objectResponse
        this.categorieddtosnotselected=this.availableCars.filter(el=>el.order==null);
        this.done=this.availableCars.filter(el=>el.order!=null).sort((a,b)=>a.order-b.order);
        this.categorieddtosoldselected=this.availableCars.filter(el=>el.order!=null).sort((a,b)=>a.order-b.order);
        this.loading=false
        
      }else{
        this.loading=false
      }
    })
  }
  availableCars: CategorieDto[]=[];

  selectedCars: CategorieDto[]=[];

  draggedCar: CategorieDto;
  dragStart(event,car: CategorieDto) {
    this.draggedCar = car;
}


  done:CategorieDto[] = [];

  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }

    console.log(this.categorieddtosoldselected);
    console.log(this.done);
    
  }


validerlist(){
let listcat:ListCategorieDto=new ListCategorieDto()
listcat.affectercategories=this.done
listcat.deletedcategories=this.categorieddtosoldselected.filter(el=>!(this.done.filter(val=>val.idCategorie==el.idCategorie).length>0))
console.log(listcat);

this._CategorieEndPointService.updatecategorievuecaisse(listcat).subscribe(val=>{
  this.loading=true
  if (val.result == 1 ){
    this._GlobalServiceService.showToast("success","Succès",'liste categorie est modifier avec succès');
    this.loading=false

   // this.productForm.reset();
  }else{
    this._GlobalServiceService.showToast('danger',"Echec",val.errorDescription);
     this.loading=false
  }
},erreur=>{
  this._GlobalServiceService.showToast('danger',"Echec","Un problème de connection est survenue, Veuillez réessayer ulterieurement");
  this.loading=false
});
}
}
