import { Component, OnInit } from '@angular/core';
import { Prodcut } from '../../../../model/Product';
import { ProductEndPointService } from '../../../../service/bp-api-product/product-end-point/product-end-point.service';

@Component({
  selector: 'ngx-listproduitbytype',
  templateUrl: './listproduitbytype.component.html',
  styleUrls: ['./listproduitbytype.component.scss']
})
export class ListproduitbytypeComponent implements OnInit {

  constructor(private _ProductEndPointService:ProductEndPointService) { }
  articleTypes=[{label:'Stockable',value:'stockable'},{label:'Consommable',value:'consommable'},{label:'Service',value:'service'}];
  loading:boolean=false
  hide:boolean=true
  listproduit:Prodcut[]=[]
  cols2:any[]
  ngOnInit() {
    this.cols2 = [
      { field: 'Désignation', header: 'Désignation' },
      { field: 'Code', header: 'Code' },
      { field: 'DateCreation', header: 'DateCreation' },
      { field: 'Composition', header: 'Composition' }
  ];
  }
  
  choosetype(event){
    console.log(event);
    this.loading=true
    this.hide=false
    this._ProductEndPointService.findAllByTypeProduit(event).subscribe(val=>{
      console.log(val);
      
      if(val.result==1){
        this.loading=false
        this.listproduit=val.objectResponse
      }else{
        this.loading=false
        this.listproduit=[]
      }
    },err=>{
      this.loading=false
      this.listproduit=[]
    })
  }

}
