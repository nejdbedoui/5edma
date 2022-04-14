import { Component, OnInit } from '@angular/core';
import { MvtStockEndPointService } from '../../../service/bp-api-product/mvt-stock-end-point/mvt-stock-end-point.service';
import { Router } from '@angular/router';
import { PackEndPointService } from '../../../service/bp-api-product/pack-end-point/pack-end-point.service';
import { ProductEndPointService } from '../../../service/bp-api-product/product-end-point/product-end-point.service';
import { Pack } from '../../../model/Pack';
import { CategorieEndPointService } from '../../../service/bp-api-product/categorie-end-point/categorie-end-point.service';
import { Categorie } from '../../../model/Categorie';
import { DateService } from '../../../service/GlobalService/DateSevice/date.service';
import { GlobalServiceService } from '../../../service/GlobalService/global-service.service';

@Component({
  selector: 'ngx-gestion-packs',
  templateUrl: './gestion-packs.component.html',
  styleUrls: ['./gestion-packs.component.scss']
})
export class GestionPacksComponent implements OnInit {

  constructor(private _MvtStockEndPointService:MvtStockEndPointService,private router:Router,
    private _PackEndPointService:PackEndPointService,private _CategorieEndPointService:CategorieEndPointService,
    private _ProductEndPointService:ProductEndPointService,private _DateService:DateService,
    private _GlobalServiceService:GlobalServiceService) { }

  loading:boolean=true
  sortOptions: any[];

    sortKey: string;

    sortField: string;

    sortOrder: number;
    prodcuts:any[]
    affichefilter:boolean=false
    categories:Categorie[]=[]
    listselectcateg:Categorie[]=[]
    deprix:number
    aprix:number
    datecreation:Date
    fannule:boolean=false
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
    this.calendar=this.calendar_fr
    this.cols = [
      { field: 'designation', header: 'designation' },
      { field: 'prixPack', header: 'prixPack' },
      { field: 'composition', header: 'composition' },
      { field: 'action', header: 'action' }

  ];
  this._CategorieEndPointService.findAllCategorieByIdpartenaire(localStorage.getItem("partenaireid")).subscribe(val=>{
    this.categories=val.objectResponse
  })
  this._ProductEndPointService.findAllByPartenaire(localStorage.getItem("partenaireid")).subscribe(val=>{
    this.prodcuts=val.objectResponse  
    console.log(this.prodcuts);   
    this._PackEndPointService.findAllPacktByIdpartner(localStorage.getItem("partenaireid")).subscribe(pv=>{
      console.log(pv);
      this.loading=false
      if(pv.result==1){
        this.packs=pv.objectResponse
        console.log(this.packs);
        this.packs.forEach(el=>{
          this.packs2.push(el)
        })
      }
    }) 
  })


  
  }
  getname(id){
    if( this.prodcuts!=null &&  this.prodcuts.length>0)
    return this.prodcuts.filter(el=>el.idProduit==id)[0].designation
  } 
packs:any[]=[]
packs2:any[]=[]


cols: any[];

redirect(){
  this.router.navigateByUrl("/pages/Pointvente/gestionPacks/NouveauPack")
}
edits(produit:any){
  console.log(produit);
  
  this.router.navigateByUrl("/pages/Pointvente/gestionPacks/ModifierPack/"+produit.idPack)
}
currentpack:Pack=new Pack()
diplaypack:boolean=false
deletes(prdouit:any){
this.currentpack=prdouit
this.diplaypack=true
  
}

deletepack(){
  this.packs=this.packs.filter(el=>el.idPack!=this.currentpack.idPack)
  this.packs2=[]
  this.packs.forEach(el=>{
    this.packs2.push(el)
  })
  this._PackEndPointService.DeletePack(this.currentpack.idPack).subscribe(val=>{
    if (val.result == 1 ){
      this._GlobalServiceService.showToast("success","Succès",'le Pack a été supprimer avec succée');

    }else{
      this._GlobalServiceService.showToast('danger',"Echec",val.errorDescription);
    }
  },erreur=>{
    this._GlobalServiceService.showToast('danger',"Echec","Un problème de connection est survenue, Veuillez réessayer ulterieurement");
  });
}
annuler(){
  this.packs=[]
  this.packs2.forEach(el=>{
    this.packs.push(el)
  })
}
search(){  
  this.annuler()
  this.fannule=true
  if(this.listselectcateg!=null && this.listselectcateg.length>0){
    if(this.deprix!=null){
      if(this.aprix!=null){
        if(this.datecreation!=null){
          this.packs=this.packs.filter(el=> el.prixPack>=this.deprix && el.prixPack<=this.aprix && this._DateService.checkdate(this.datecreation,el.dateCreation) && (el.categoriesArticles!=null && el.categoriesArticles.length>0)?el.categoriesArticles.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val).length>0 ).length>0:false)          
        }else{
          this.packs=this.packs.filter(el=> el.prixPack>=this.deprix && el.prixPack<=this.aprix && (el.categoriesArticles!=null && el.categoriesArticles.length>0)?el.categoriesArticles.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val).length>0 ).length>0:false)          
        }
      }else{
        if(this.datecreation!=null){
          this.packs=this.packs.filter(el=> el.prixPack>=this.deprix && this._DateService.checkdate(this.datecreation,el.dateCreation) && (el.categoriesArticles!=null && el.categoriesArticles.length>0)?el.categoriesArticles.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val).length>0 ).length>0:false)          
        }else{
          this.packs=this.packs.filter(el=> el.prixPack>=this.deprix && (el.categoriesArticles!=null && el.categoriesArticles.length>0)?el.categoriesArticles.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val).length>0 ).length>0:false)          
        }
      }
    }else{
      if(this.aprix!=null){
        if(this.datecreation!=null){
          this.packs=this.packs.filter(el=>  el.prixPack<=this.aprix && this._DateService.checkdate(this.datecreation,el.dateCreation) && (el.categoriesArticles!=null && el.categoriesArticles.length>0)?el.categoriesArticles.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val).length>0 ).length>0:false)          
        }else{
          this.packs=this.packs.filter(el=>  el.prixPack<=this.aprix && (el.categoriesArticles!=null && el.categoriesArticles.length>0)?el.categoriesArticles.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val).length>0 ).length>0:false)          
        }
      }else{
        if(this.datecreation!=null){
          this.packs=this.packs.filter(el=> this._DateService.checkdate(this.datecreation,el.dateCreation) && (el.categoriesArticles!=null && el.categoriesArticles.length>0)?el.categoriesArticles.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val).length>0 ).length>0:false)          
        }else{
          this.packs=this.packs.filter(el=> (el.categoriesArticles!=null && el.categoriesArticles.length>0)?el.categoriesArticles.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val).length>0 ).length>0:false)          
        }
      }
    }
  }else{
    if(this.deprix!=null){
      if(this.aprix!=null){
        if(this.datecreation!=null){
          this.packs=this.packs.filter(el=> el.prixPack>=this.deprix && el.prixPack<=this.aprix && this._DateService.checkdate(this.datecreation,el.dateCreation) )          
        }else{
          this.packs=this.packs.filter(el=> el.prixPack>=this.deprix && el.prixPack<=this.aprix )          
        }
      }else{
        if(this.datecreation!=null){
          this.packs=this.packs.filter(el=> el.prixPack>=this.deprix && this._DateService.checkdate(this.datecreation,el.dateCreation) )          
        }else{
          this.packs=this.packs.filter(el=> el.prixPack>=this.deprix )          
        }
      }
    }else{
      if(this.aprix!=null){
        if(this.datecreation!=null){
          this.packs=this.packs.filter(el=>  el.prixPack<=this.aprix && this._DateService.checkdate(this.datecreation,el.dateCreation) )          
        }else{
          this.packs=this.packs.filter(el=>  el.prixPack<=this.aprix )          
        }
      }else{
        if(this.datecreation!=null){
          this.packs=this.packs.filter(el=> this._DateService.checkdate(this.datecreation,el.dateCreation) )          
        }else{
          this.packs=this.packs.filter(el=>true)          
        }
      }
    }
  }

}
}
