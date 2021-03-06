import { Component, OnInit } from '@angular/core';
import { MvtStockEndPointService } from '../../../service/bp-api-product/mvt-stock-end-point/mvt-stock-end-point.service';
import { Router } from '@angular/router';
import { PackEndPointService } from '../../../service/bp-api-product/pack-end-point/pack-end-point.service';
import { CategorieEndPointService } from '../../../service/bp-api-product/categorie-end-point/categorie-end-point.service';
import { ProductEndPointService } from '../../../service/bp-api-product/product-end-point/product-end-point.service';
import { DateService } from '../../../service/GlobalService/DateSevice/date.service';
import { Categorie } from '../../../model/Categorie';
import { Pack } from '../../../model/Pack';
import { ReglesFideliteProduitEndPointService } from '../../../service/bp-api-loyality/regles-fidelite-produit-end-point/regles-fidelite-produit-end-point.service';
import { ReglesFideliteProduit } from '../../../model/ReglesFideliteProduit';
import { GlobalServiceService } from '../../../service/GlobalService/global-service.service';

@Component({
  selector: 'ngx-action-commerciale',
  templateUrl: './action-commerciale.component.html',
  styleUrls: ['./action-commerciale.component.scss']
})
export class ActionCommercialeComponent implements OnInit {

  constructor(private _MvtStockEndPointService:MvtStockEndPointService,private router:Router,
    private _PackEndPointService:PackEndPointService,private _CategorieEndPointService:CategorieEndPointService,
    private _ProductEndPointService:ProductEndPointService,private _DateService:DateService,
    private _ReglesFideliteProduitEndPointService:ReglesFideliteProduitEndPointService,
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
      prevText: "Pr??c??dent",
      nextText: "Suivant",
      currentText: "Aujourd'hui",
      monthNames: [ "janvier", "f??vrier", "mars", "avril", "mai", "juin",
        "juillet", "ao??t", "septembre", "octobre", "novembre", "d??cembre" ],
      monthNamesShort: [ "janv.", "f??vr.", "mars", "avr.", "mai", "juin",
        "juil.", "ao??t", "sept.", "oct.", "nov.", "d??c." ],
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
    remisetype=[{label:'remise caisse',value:'remise'},{label:'remboursement carte',value:'remboursement carte'}];

  ngOnInit() {
    this.calendar=this.calendar_fr
    this.cols = [
      { field: 'designation', header: 'designation' },
      { field: 'prixPack', header: 'prixPack' },
      { field: 'composition', header: 'composition' },
      { field: 'action', header: 'action' }

  ];
  this._ProductEndPointService.findAllByPartenaire(localStorage.getItem("partenaireid")).subscribe(val=>{
    this.prodcuts=val.objectResponse  
    //console.log(this.prodcuts);   
    this._ReglesFideliteProduitEndPointService.findAllReglesFideliteProduitByIdPartenaire(localStorage.getItem("partenaireid")).subscribe(pv=>{
      console.log(pv);
      this.loading=false
      if(pv.result==1){
        this.packs=pv.objectResponse
        // console.log(this.packs);
        // this.packs.forEach(el=>{
        //   this.packs2.push(el)
        // })
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
gettyprfid(val){
return  this.remisetype.filter(el=>el.value==val)[0].label
}

redirect(){
  this.router.navigateByUrl("/pages/Pointvente/actionCommerciale/NouvelleAction")
}
edits(produit:any){
  console.log(produit);
  
  this.router.navigateByUrl("/pages/Pointvente/actionCommerciale/ModifierAction/"+produit.idRegle)
}
currentpack:ReglesFideliteProduit=new ReglesFideliteProduit()
diplaypack:boolean=false
deletes(prdouit:any){
this.currentpack=prdouit
this.diplaypack=true
  
}

deletepack(){
  this.packs=this.packs.filter(el=>el.idRegle!=this.currentpack.idRegle)
  this.packs2=[]
  this.packs.forEach(el=>{
    this.packs2.push(el)
  })
  this._ReglesFideliteProduitEndPointService.DeleteReglesFideliteProduit(this.currentpack.idRegle).subscribe(val=>{
    if (val.result == 1 ){
      this._GlobalServiceService.showToast("success","Succ??s","l'action Commerciale a ??t?? supprimer avec succ??e");

    }else{
      this._GlobalServiceService.showToast('danger',"Echec",val.errorDescription);
    }
  },erreur=>{
    this._GlobalServiceService.showToast('danger',"Echec","Un probl??me de connection est survenue, Veuillez r??essayer ulterieurement");
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
