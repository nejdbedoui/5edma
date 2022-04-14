import { Component, OnInit } from '@angular/core';
import { PointVenteEndPointService } from '../../../service/bp-api-pos/point-vente-end-point/point-vente-end-point.service';
import { PointVente } from '../../../model/PointVente';
import { CategorieEndPointService } from '../../../service/bp-api-product/categorie-end-point/categorie-end-point.service';
import { CategorieDto } from '../../../model/dto/CategorieDto';
import { Router } from '@angular/router';
import { ProductEndPointService } from '../../../service/bp-api-product/product-end-point/product-end-point.service';
import { ExportCategorie } from '../../../model/ExportCategorie';
import { formatDate } from '@angular/common';

@Component({
  selector: 'ngx-gestion-categorie',
  templateUrl: './gestion-categorie.component.html',
  styleUrls: ['./gestion-categorie.component.scss']
})
export class GestionCategorieComponent implements OnInit {

  constructor(private _PointVenteEndPointService:PointVenteEndPointService,private _CategorieEndPointService:CategorieEndPointService,
    private router:Router,private _ProductEndPointService:ProductEndPointService) { }

  loading:boolean=true
  sortOptions: any[];

    sortKey: string;

    sortField: string;
    idpointVente=localStorage.getItem("pointventeid")
    sortOrder: number;
    diplay:boolean=false;
    
  ngOnInit() {
    this.cols = [
      { field: 'Désignation', header: 'Désignation' },
      { field: 'Contient des Sous catégoriess', header: 'Contient des sous catégories' },
      { field: 'DateCreation', header: 'DateCreation' },
      { field: 'Action', header: 'Action' }

  ];
  // if(localStorage.getItem("pointventeid")){
  //   this._CategorieEndPointService.listcategorieArticleForPointVente(localStorage.getItem("pointventeid")).subscribe(pv=>{
  //     if(pv.result==1){
  //       this.categoriedtos=pv.objectResponse
  //       console.log(this.categoriedtos);
  //       this.loading=false
  //     }else{
  //       this.loading=false
  //     }
  //   })
  // }else{
    this._CategorieEndPointService.findAllCategoryByIdpartenaire(localStorage.getItem("partenaireid")).subscribe(pv=>{
      if(pv.result==1){
        this.loading=false

        this.categoriedtos=pv.objectResponse
        console.log(this.categoriedtos);
        
      }else{
        this.loading=false
      }
    })
  //}

  }

  exportExcel() {
    let exportCategories:ExportCategorie[]=[]
    this.categoriedtos.forEach(el=>{
      let exportCategorie:ExportCategorie=new ExportCategorie()
      exportCategorie.désignation=el.designation

      let concatstring:string=""
      el.fils.forEach(item => {
        concatstring=concatstring+"/"+item.designation
      });
      exportCategorie.sous_catégories=concatstring;
      exportCategorie.Date_création=el.dateCreation;
      exportCategories.push(exportCategorie)
    })
    
    import("xlsx").then(xlsx => {
        const worksheet = xlsx.utils.json_to_sheet(exportCategories);
        const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, "categories");
    });
}

saveAsExcelFile(buffer: any, fileName: string): void {
  import("file-saver").then(FileSaver => {
      let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      let EXCEL_EXTENSION = '.xlsx';
      const data: Blob = new Blob([buffer], {
          type: EXCEL_TYPE
      });
      FileSaver.saveAs(data, fileName + '_export_' + formatDate(new Date(), 'dd_MM_yyyy_hh_mm', 'en-US') + EXCEL_EXTENSION);
  });
}
 
categoriedtos:CategorieDto[]
choosepointvente(pointvente:PointVente){
  console.log(pointvente);  

}

cols: any[];

redirect(){
  this.router.navigateByUrl("/pages/Pointvente/gestionCategorieArticle/NouvelleCategorieArticle")
}
products:any[]=[]
loading2:boolean=false
getlistproduit(id:string){
  this.diplay=true
  this.loading2=true
  this.products=[]
  console.log(id);
  console.log(this.idpointVente);
  
  this._ProductEndPointService.findAllProductByIdCategorieArticle(id).subscribe(val=>{
    console.log(val);
    
    if(val.objectResponse!=null){
      this.products=val.objectResponse 
    }else{
      this.products=[]
    }
    this.loading2=false   
  })
}

}
