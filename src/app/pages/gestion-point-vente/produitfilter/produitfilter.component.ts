import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Categorie } from '../../../model/Categorie';
import { ProductEndPointService } from '../../../service/bp-api-product/product-end-point/product-end-point.service';
import { Router } from '@angular/router';
import { GlobalServiceService } from '../../../service/GlobalService/global-service.service';
import { FormBuilder } from '@angular/forms';
import { ReglesFideliteProduitEndPointService } from '../../../service/bp-api-loyality/regles-fidelite-produit-end-point/regles-fidelite-produit-end-point.service';
import { DeviseEndPointService } from '../../../service/bp-api-pos/devise-end-point/devise-end-point.service';
import { CategorieEndPointService } from '../../../service/bp-api-product/categorie-end-point/categorie-end-point.service';
import { DateService } from '../../../service/GlobalService/DateSevice/date.service';
import { Prodcut } from '../../../model/Product';

@Component({
  selector: 'ngx-produitfilter',
  templateUrl: './produitfilter.component.html',
  styleUrls: ['./produitfilter.component.scss']
})
export class ProduitfilterComponent implements OnInit {
  @Output() changePage = new EventEmitter<any>(true);
  constructor(private _ProductEndPointService:ProductEndPointService,private router:Router,
    private _GlobalService:GlobalServiceService,private _FormBuilder:FormBuilder,
    private _ReglesFideliteProduitEndPointService:ReglesFideliteProduitEndPointService,
    private _DeviseEndPointService:DeviseEndPointService,
    private _CategorieEndPointService:CategorieEndPointService,
    private _DateService:DateService) { }
    
  articleTypes=[{label:'Stockable',value:'stockable'},{label:'Consommable',value:'consommable'},{label:'Service',value:'service'}];
  loading:boolean=true
  categories:Categorie[]=[]
  cols2:any[]
  affichefilter:boolean=false
  listselectcateg:Categorie[]=[]
  deprix:number
  aprix:number
  datecreation:Date
  notaffectedtocateg:boolean=false
  repturedestock:boolean=false
  presquerepturestock:boolean=false
  aveccodeinterne:boolean=false
  fannule:boolean=false
  listproduit:any[]=[]
  listproduit2:any[]=[]
  currentregle:Prodcut=new Prodcut() 
  diplayregle:boolean=false
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
  selectedCars3: any[];
  ngOnInit() {
    this.calendar=this.calendar_fr
    this.cols2 = [
      { field: 'Action', header: 'Action' },
      { field: 'Désignation', header: 'Désignation' },
      { field: 'Code a Barre', header: 'Code a Barre' },
      { field: 'DateCreation', header: 'DateCreation' },
      { field: 'Composition', header: 'Composition' },
      { field: 'Composition', header: 'Composition' },
      { field: 'Composition', header: 'Composition' },
      { field: 'Composition', header: 'Composition' },
      
  ];
  this._CategorieEndPointService.findAllCategorieByIdpartenaire(localStorage.getItem("partenaireid")).subscribe(val=>{
    this.categories=val.objectResponse
  
    this._ProductEndPointService.findAllByPartenairewithcategorie(localStorage.getItem("partenaireid")).subscribe(val=>{
      console.log(val);
      
      if(val.result==1){
        this.loading=false
        this.listproduit=val.objectResponse
        this.listproduit.forEach(el=>{
          this.listproduit2.push(el)
        })
      }else{
        this.loading=false
        this.listproduit=[]
      }
    },err=>{
      this.loading=false
      this.listproduit=[]
    })
  })
  }
  filtercriter(){

  }
  getname(idcatagorie){    
    let listcata:any=this.categories.filter(el=>el.idCategorie==idcatagorie)
    if(listcata!=null){
      return listcata[0]!=null?listcata[0].designation:''
    }else{
      return ''
    }
  }
  edits(produit:Prodcut){
    this.router.navigateByUrl("/pages/Pointvente/gestionProduit/ModifierProduit/"+produit.idProduit)
  }
  deletes(prdouit:Prodcut){
  this.currentregle=prdouit
  this.diplayregle=true
    
  }
  annuler(){
    this.listproduit=[]
    this.listproduit2.forEach(el=>{
      this.listproduit.push(el)
    })
  }
  search(){
    this.annuler()
    console.log(this.listselectcateg,this.deprix,this.aprix,this.datecreation,this.notaffectedtocateg,this.repturedestock,this.presquerepturestock,this.aveccodeinterne);
    this.fannule=true
    if(this.listselectcateg!=null && this.listselectcateg.length>0){
      if(this.deprix!=null){
        if(this.aprix!=null){
          if(this.datecreation!=null){
            if(this.notaffectedtocateg){
              if(this.repturedestock){
                if(this.presquerepturestock){
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.categorieArticleProduits.length==0 && el.produit.stockReel==0 && el.produit.stockAlert>=el.produit.stockReel && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.categorieArticleProduits.length==0 && el.produit.stockReel==0 && el.produit.stockAlert>=el.produit.stockReel )

                  }
                }else{
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.categorieArticleProduits.length==0 && el.produit.stockReel==0 && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.categorieArticleProduits.length==0 && el.produit.stockReel==0 )

                  }
                }
              }else{
                if(this.presquerepturestock){
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.categorieArticleProduits.length==0 &&  el.produit.stockAlert>=el.produit.stockReel && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.categorieArticleProduits.length==0 && el.produit.stockAlert>=el.produit.stockReel  )

                  }
                }else{
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.categorieArticleProduits.length==0 && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.categorieArticleProduits.length==0 )

                  }
                }
              }
            }else{
              if(this.repturedestock){
                if(this.presquerepturestock){
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.produit.stockReel==0 && el.produit.stockAlert>=el.produit.stockReel && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation)  && el.produit.stockReel==0 && el.produit.stockAlert>=el.produit.stockReel  )

                  }
                }else{
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation)  && el.produit.stockReel==0 && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation)  && el.produit.stockReel==0  )

                  }
                }
              }else{
                if(this.presquerepturestock){
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.produit.stockAlert>=el.produit.stockReel && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.produit.stockAlert>=el.produit.stockReel )

                  }
                }else{
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.produit.stockAlert>=el.produit.stockReel )
                  }
                }
              }
            }
          }else{
            if(this.notaffectedtocateg){
              if(this.repturedestock){
                if(this.presquerepturestock){
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && el.categorieArticleProduits.length==0 && el.produit.stockReel==0 && el.produit.stockAlert>=el.produit.stockReel && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && el.categorieArticleProduits.length==0 && el.produit.stockReel==0 && el.produit.stockAlert>=el.produit.stockReel )

                  }
                }else{
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && el.categorieArticleProduits.length==0 && el.produit.stockReel==0  && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && el.categorieArticleProduits.length==0 && el.produit.stockReel==0 )

                  }
                }
              }else{
                if(this.presquerepturestock){
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && el.categorieArticleProduits.length==0  && el.produit.stockAlert>=el.produit.stockReel && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && el.categorieArticleProduits.length==0 && el.produit.stockReel==0 && el.produit.stockAlert>=el.produit.stockReel && el.produit.referenceInterne!=null )

                  }
                }else{
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && el.categorieArticleProduits.length==0  && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && el.categorieArticleProduits.length==0 )

                  }
                }
              }
            }else{
              if(this.repturedestock){
                if(this.presquerepturestock){
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix  && el.produit.stockReel==0 && el.produit.stockAlert>=el.produit.stockReel && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix  && el.produit.stockReel==0 && el.produit.stockAlert>=el.produit.stockReel )

                  }
                }else{
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix  && el.produit.stockReel==0  && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix  && el.produit.stockReel==0 )

                  }
                }
              }else{
                if(this.presquerepturestock){
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix   && el.produit.stockAlert>=el.produit.stockReel && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix  && el.produit.stockReel==0 && el.produit.stockAlert>=el.produit.stockReel && el.produit.referenceInterne!=null )

                  }
                }else{
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix   && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix )

                  }
                }
              }
            }
          }
        }else{
          if(this.datecreation!=null){
            if(this.notaffectedtocateg){
              if(this.repturedestock){
                if(this.presquerepturestock){
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.categorieArticleProduits.length==0 && el.produit.stockReel==0 && el.produit.stockAlert>=el.produit.stockReel && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.categorieArticleProduits.length==0 && el.produit.stockReel==0 && el.produit.stockAlert>=el.produit.stockReel )

                  }
                }else{
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.categorieArticleProduits.length==0 && el.produit.stockReel==0 && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.categorieArticleProduits.length==0 && el.produit.stockReel==0 )

                  }
                }
              }else{
                if(this.presquerepturestock){
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.categorieArticleProduits.length==0 &&  el.produit.stockAlert>=el.produit.stockReel && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.categorieArticleProduits.length==0 && el.produit.stockAlert>=el.produit.stockReel  )

                  }
                }else{
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.categorieArticleProduits.length==0 && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.categorieArticleProduits.length==0 )

                  }
                }
              }
            }else{
              if(this.repturedestock){
                if(this.presquerepturestock){
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.produit.stockReel==0 && el.produit.stockAlert>=el.produit.stockReel && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation)  && el.produit.stockReel==0 && el.produit.stockAlert>=el.produit.stockReel  )

                  }
                }else{
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation)  && el.produit.stockReel==0 && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation)  && el.produit.stockReel==0  )

                  }
                }
              }else{
                if(this.presquerepturestock){
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.produit.stockAlert>=el.produit.stockReel && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.produit.stockAlert>=el.produit.stockReel )

                  }
                }else{
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.produit.stockAlert>=el.produit.stockReel )
                  }
                }
              }
            }
          }else{
            if(this.notaffectedtocateg){
              if(this.repturedestock){
                if(this.presquerepturestock){
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix  && el.categorieArticleProduits.length==0 && el.produit.stockReel==0 && el.produit.stockAlert>=el.produit.stockReel && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix  && el.categorieArticleProduits.length==0 && el.produit.stockReel==0 && el.produit.stockAlert>=el.produit.stockReel )

                  }
                }else{
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix  && el.categorieArticleProduits.length==0 && el.produit.stockReel==0  && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix  && el.categorieArticleProduits.length==0 && el.produit.stockReel==0 )

                  }
                }
              }else{
                if(this.presquerepturestock){
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix  && el.categorieArticleProduits.length==0  && el.produit.stockAlert>=el.produit.stockReel && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix  && el.categorieArticleProduits.length==0 && el.produit.stockReel==0 && el.produit.stockAlert>=el.produit.stockReel && el.produit.referenceInterne!=null )

                  }
                }else{
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix  && el.categorieArticleProduits.length==0  && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix  && el.categorieArticleProduits.length==0 )

                  }
                }
              }
            }else{
              if(this.repturedestock){
                if(this.presquerepturestock){
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix  && el.produit.stockReel==0 && el.produit.stockAlert>=el.produit.stockReel && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix  && el.produit.stockReel==0 && el.produit.stockAlert>=el.produit.stockReel )

                  }
                }else{
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix  && el.produit.stockReel==0  && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix  && el.produit.stockReel==0 )

                  }
                }
              }else{
                if(this.presquerepturestock){
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix  && el.produit.stockAlert>=el.produit.stockReel && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix && el.produit.stockReel==0 && el.produit.stockAlert>=el.produit.stockReel && el.produit.referenceInterne!=null )

                  }
                }else{
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix && el.produit.referenceInterne!=null )

                  }else{
                    console.log('6666666666666666666666');
                    
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix)

                  }
                }
              }
            }
          }
        }
      }else{
        if(this.aprix!=null){
          if(this.datecreation!=null){
            if(this.notaffectedtocateg){
              if(this.repturedestock){
                if(this.presquerepturestock){
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.categorieArticleProduits.length==0 && el.produit.stockReel==0 && el.produit.stockAlert>=el.produit.stockReel && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.categorieArticleProduits.length==0 && el.produit.stockReel==0 && el.produit.stockAlert>=el.produit.stockReel )

                  }
                }else{
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.categorieArticleProduits.length==0 && el.produit.stockReel==0 && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.categorieArticleProduits.length==0 && el.produit.stockReel==0 )

                  }
                }
              }else{
                if(this.presquerepturestock){
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.categorieArticleProduits.length==0 &&  el.produit.stockAlert>=el.produit.stockReel && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.categorieArticleProduits.length==0 && el.produit.stockAlert>=el.produit.stockReel  )

                  }
                }else{
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.categorieArticleProduits.length==0 && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.categorieArticleProduits.length==0 )

                  }
                }
              }
            }else{
              if(this.repturedestock){
                if(this.presquerepturestock){
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.produit.stockReel==0 && el.produit.stockAlert>=el.produit.stockReel && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation)  && el.produit.stockReel==0 && el.produit.stockAlert>=el.produit.stockReel  )

                  }
                }else{
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation)  && el.produit.stockReel==0 && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation)  && el.produit.stockReel==0  )

                  }
                }
              }else{
                if(this.presquerepturestock){
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.produit.stockAlert>=el.produit.stockReel && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.produit.stockAlert>=el.produit.stockReel )

                  }
                }else{
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.produit.stockAlert>=el.produit.stockReel )
                  }
                }
              }
            }
          }else{
            if(this.notaffectedtocateg){
              if(this.repturedestock){
                if(this.presquerepturestock){
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && el.categorieArticleProduits.length==0 && el.produit.stockReel==0 && el.produit.stockAlert>=el.produit.stockReel && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && el.categorieArticleProduits.length==0 && el.produit.stockReel==0 && el.produit.stockAlert>=el.produit.stockReel )

                  }
                }else{
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && el.categorieArticleProduits.length==0 && el.produit.stockReel==0  && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && el.categorieArticleProduits.length==0 && el.produit.stockReel==0 )

                  }
                }
              }else{
                if(this.presquerepturestock){
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && el.categorieArticleProduits.length==0  && el.produit.stockAlert>=el.produit.stockReel && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && el.categorieArticleProduits.length==0 && el.produit.stockReel==0 && el.produit.stockAlert>=el.produit.stockReel && el.produit.referenceInterne!=null )

                  }
                }else{
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && el.categorieArticleProduits.length==0  && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && el.categorieArticleProduits.length==0 )

                  }
                }
              }
            }else{
              if(this.repturedestock){
                if(this.presquerepturestock){
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix  && el.produit.stockReel==0 && el.produit.stockAlert>=el.produit.stockReel && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix  && el.produit.stockReel==0 && el.produit.stockAlert>=el.produit.stockReel )

                  }
                }else{
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix  && el.produit.stockReel==0  && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix  && el.produit.stockReel==0 )

                  }
                }
              }else{
                if(this.presquerepturestock){
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix   && el.produit.stockAlert>=el.produit.stockReel && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix  && el.produit.stockReel==0 && el.produit.stockAlert>=el.produit.stockReel && el.produit.referenceInterne!=null )

                  }
                }else{
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix   && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix )

                  }
                }
              }
            }
          }
        }else{
          if(this.datecreation!=null){
            if(this.notaffectedtocateg){
              if(this.repturedestock){
                if(this.presquerepturestock){
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0  && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.categorieArticleProduits.length==0 && el.produit.stockReel==0 && el.produit.stockAlert>=el.produit.stockReel && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0  && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.categorieArticleProduits.length==0 && el.produit.stockReel==0 && el.produit.stockAlert>=el.produit.stockReel )

                  }
                }else{
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0  && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.categorieArticleProduits.length==0 && el.produit.stockReel==0 && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0  && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.categorieArticleProduits.length==0 && el.produit.stockReel==0 )

                  }
                }
              }else{
                if(this.presquerepturestock){
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0  && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.categorieArticleProduits.length==0 &&  el.produit.stockAlert>=el.produit.stockReel && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0  && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.categorieArticleProduits.length==0 && el.produit.stockAlert>=el.produit.stockReel  )

                  }
                }else{
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0  && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.categorieArticleProduits.length==0 && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0  && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.categorieArticleProduits.length==0 )

                  }
                }
              }
            }else{
              if(this.repturedestock){
                if(this.presquerepturestock){
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0  && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.produit.stockReel==0 && el.produit.stockAlert>=el.produit.stockReel && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0  && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation)  && el.produit.stockReel==0 && el.produit.stockAlert>=el.produit.stockReel  )

                  }
                }else{
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0  && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation)  && el.produit.stockReel==0 && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0  && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation)  && el.produit.stockReel==0  )

                  }
                }
              }else{
                if(this.presquerepturestock){
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0  && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.produit.stockAlert>=el.produit.stockReel && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0  && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.produit.stockAlert>=el.produit.stockReel )

                  }
                }else{
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0  && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.produit.stockAlert>=el.produit.stockReel )
                  }
                }
              }
            }
          }else{
            if(this.notaffectedtocateg){
              if(this.repturedestock){
                if(this.presquerepturestock){
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0   && el.categorieArticleProduits.length==0 && el.produit.stockReel==0 && el.produit.stockAlert>=el.produit.stockReel && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0   && el.categorieArticleProduits.length==0 && el.produit.stockReel==0 && el.produit.stockAlert>=el.produit.stockReel )

                  }
                }else{
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0   && el.categorieArticleProduits.length==0 && el.produit.stockReel==0  && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0   && el.categorieArticleProduits.length==0 && el.produit.stockReel==0 )

                  }
                }
              }else{
                if(this.presquerepturestock){
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0   && el.categorieArticleProduits.length==0  && el.produit.stockAlert>=el.produit.stockReel && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0   && el.categorieArticleProduits.length==0 && el.produit.stockReel==0 && el.produit.stockAlert>=el.produit.stockReel && el.produit.referenceInterne!=null )

                  }
                }else{
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0   && el.categorieArticleProduits.length==0  && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0   && el.categorieArticleProduits.length==0 )

                  }
                }
              }
            }else{
              if(this.repturedestock){
                if(this.presquerepturestock){
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0   && el.produit.stockReel==0 && el.produit.stockAlert>=el.produit.stockReel && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0   && el.produit.stockReel==0 && el.produit.stockAlert>=el.produit.stockReel )

                  }
                }else{
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0   && el.produit.stockReel==0  && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0   && el.produit.stockReel==0 )

                  }
                }
              }else{
                if(this.presquerepturestock){
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0   && el.produit.stockAlert>=el.produit.stockReel && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.stockReel==0 && el.produit.stockAlert>=el.produit.stockReel && el.produit.referenceInterne!=null )

                  }
                }else{
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0 && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=>el.categorieArticleProduits.filter(val=>this.listselectcateg.filter(vall=>vall.idCategorie==val.idCategArticle).length>0 ).length>0)

                  }
                }
              }
            }
          }
        }
      }
    }else{
      if(this.deprix!=null){
        if(this.aprix!=null){
          if(this.datecreation!=null){
            if(this.notaffectedtocateg){
              if(this.repturedestock){
                if(this.presquerepturestock){
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=> el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.categorieArticleProduits.length==0 && el.produit.stockReel==0 && el.produit.stockAlert>=el.produit.stockReel && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=> el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.categorieArticleProduits.length==0 && el.produit.stockReel==0 && el.produit.stockAlert>=el.produit.stockReel )

                  }
                }else{
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=> el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.categorieArticleProduits.length==0 && el.produit.stockReel==0 && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=>el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.categorieArticleProduits.length==0 && el.produit.stockReel==0 )

                  }
                }
              }else{
                if(this.presquerepturestock){
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=> el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.categorieArticleProduits.length==0 &&  el.produit.stockAlert>=el.produit.stockReel && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=>el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.categorieArticleProduits.length==0 && el.produit.stockAlert>=el.produit.stockReel  )

                  }
                }else{
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=>el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.categorieArticleProduits.length==0 && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=>el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.categorieArticleProduits.length==0 )

                  }
                }
              }
            }else{
              if(this.repturedestock){
                if(this.presquerepturestock){
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=> el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.produit.stockReel==0 && el.produit.stockAlert>=el.produit.stockReel && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=>el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation)  && el.produit.stockReel==0 && el.produit.stockAlert>=el.produit.stockReel  )

                  }
                }else{
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=>el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation)  && el.produit.stockReel==0 && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=>el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation)  && el.produit.stockReel==0  )

                  }
                }
              }else{
                if(this.presquerepturestock){
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=>el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.produit.stockAlert>=el.produit.stockReel && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=>el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.produit.stockAlert>=el.produit.stockReel )

                  }
                }else{
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=> el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=>el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.produit.stockAlert>=el.produit.stockReel )
                  }
                }
              }
            }
          }else{
            if(this.notaffectedtocateg){
              if(this.repturedestock){
                if(this.presquerepturestock){
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=>el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && el.categorieArticleProduits.length==0 && el.produit.stockReel==0 && el.produit.stockAlert>=el.produit.stockReel && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=>el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && el.categorieArticleProduits.length==0 && el.produit.stockReel==0 && el.produit.stockAlert>=el.produit.stockReel )

                  }
                }else{
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=>el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && el.categorieArticleProduits.length==0 && el.produit.stockReel==0  && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=>el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && el.categorieArticleProduits.length==0 && el.produit.stockReel==0 )

                  }
                }
              }else{
                if(this.presquerepturestock){
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=>el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && el.categorieArticleProduits.length==0  && el.produit.stockAlert>=el.produit.stockReel && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=> el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && el.categorieArticleProduits.length==0 && el.produit.stockReel==0 && el.produit.stockAlert>=el.produit.stockReel && el.produit.referenceInterne!=null )

                  }
                }else{
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=>el.produit.prixTtc<this.aprix && el.categorieArticleProduits.length==0  && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=>el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && el.categorieArticleProduits.length==0 )

                  }
                }
              }
            }else{
              if(this.repturedestock){
                if(this.presquerepturestock){
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=> el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix  && el.produit.stockReel==0 && el.produit.stockAlert>=el.produit.stockReel && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=> el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix  && el.produit.stockReel==0 && el.produit.stockAlert>=el.produit.stockReel )

                  }
                }else{
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=> el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix  && el.produit.stockReel==0  && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=> el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix  && el.produit.stockReel==0 )

                  }
                }
              }else{
                if(this.presquerepturestock){
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=> el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix   && el.produit.stockAlert>=el.produit.stockReel && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=> el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix  && el.produit.stockReel==0 && el.produit.stockAlert>=el.produit.stockReel && el.produit.referenceInterne!=null )

                  }
                }else{
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=> el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix   && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=> el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix )

                  }
                }
              }
            }
          }
        }else{
          if(this.datecreation!=null){
            if(this.notaffectedtocateg){
              if(this.repturedestock){
                if(this.presquerepturestock){
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=> el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.categorieArticleProduits.length==0 && el.produit.stockReel==0 && el.produit.stockAlert>=el.produit.stockReel && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=> el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.categorieArticleProduits.length==0 && el.produit.stockReel==0 && el.produit.stockAlert>=el.produit.stockReel )

                  }
                }else{
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=> el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.categorieArticleProduits.length==0 && el.produit.stockReel==0 && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=> el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.categorieArticleProduits.length==0 && el.produit.stockReel==0 )

                  }
                }
              }else{
                if(this.presquerepturestock){
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=> el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.categorieArticleProduits.length==0 &&  el.produit.stockAlert>=el.produit.stockReel && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=> el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.categorieArticleProduits.length==0 && el.produit.stockAlert>=el.produit.stockReel  )

                  }
                }else{
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=> el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.categorieArticleProduits.length==0 && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=> el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.categorieArticleProduits.length==0 )

                  }
                }
              }
            }else{
              if(this.repturedestock){
                if(this.presquerepturestock){
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=> el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.produit.stockReel==0 && el.produit.stockAlert>=el.produit.stockReel && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=> el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation)  && el.produit.stockReel==0 && el.produit.stockAlert>=el.produit.stockReel  )

                  }
                }else{
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=> el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation)  && el.produit.stockReel==0 && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=> el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation)  && el.produit.stockReel==0  )

                  }
                }
              }else{
                if(this.presquerepturestock){
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=> el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.produit.stockAlert>=el.produit.stockReel && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=> el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.produit.stockAlert>=el.produit.stockReel )

                  }
                }else{
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=> el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=> el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.produit.stockAlert>=el.produit.stockReel )
                  }
                }
              }
            }
          }else{
            if(this.notaffectedtocateg){
              if(this.repturedestock){
                if(this.presquerepturestock){
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=> el.produit.prixTtc>this.deprix  && el.categorieArticleProduits.length==0 && el.produit.stockReel==0 && el.produit.stockAlert>=el.produit.stockReel && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=> el.produit.prixTtc>this.deprix  && el.categorieArticleProduits.length==0 && el.produit.stockReel==0 && el.produit.stockAlert>=el.produit.stockReel )

                  }
                }else{
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=> el.produit.prixTtc>this.deprix  && el.categorieArticleProduits.length==0 && el.produit.stockReel==0  && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=> el.produit.prixTtc>this.deprix  && el.categorieArticleProduits.length==0 && el.produit.stockReel==0 )

                  }
                }
              }else{
                if(this.presquerepturestock){
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=> el.produit.prixTtc>this.deprix  && el.categorieArticleProduits.length==0  && el.produit.stockAlert>=el.produit.stockReel && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=> el.produit.prixTtc>this.deprix  && el.categorieArticleProduits.length==0 && el.produit.stockReel==0 && el.produit.stockAlert>=el.produit.stockReel && el.produit.referenceInterne!=null )

                  }
                }else{
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=> el.produit.prixTtc>this.deprix  && el.categorieArticleProduits.length==0  && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=> el.produit.prixTtc>this.deprix  && el.categorieArticleProduits.length==0 )

                  }
                }
              }
            }else{
              if(this.repturedestock){
                if(this.presquerepturestock){
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=> el.produit.prixTtc>this.deprix  && el.produit.stockReel==0 && el.produit.stockAlert>=el.produit.stockReel && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=> el.produit.prixTtc>this.deprix  && el.produit.stockReel==0 && el.produit.stockAlert>=el.produit.stockReel )

                  }
                }else{
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=> el.produit.prixTtc>this.deprix  && el.produit.stockReel==0  && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=> el.produit.prixTtc>this.deprix  && el.produit.stockReel==0 )

                  }
                }
              }else{
                if(this.presquerepturestock){
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=> el.produit.prixTtc>this.deprix  && el.produit.stockAlert>=el.produit.stockReel && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=> el.produit.prixTtc>this.deprix && el.produit.stockReel==0 && el.produit.stockAlert>=el.produit.stockReel && el.produit.referenceInterne!=null )

                  }
                }else{
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=> el.produit.prixTtc>this.deprix && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=> el.produit.prixTtc>this.deprix)

                  }
                }
              }
            }
          }
        }
      }else{
        if(this.aprix!=null){
          if(this.datecreation!=null){
            if(this.notaffectedtocateg){
              if(this.repturedestock){
                if(this.presquerepturestock){
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=> el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.categorieArticleProduits.length==0 && el.produit.stockReel==0 && el.produit.stockAlert>=el.produit.stockReel && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=> el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.categorieArticleProduits.length==0 && el.produit.stockReel==0 && el.produit.stockAlert>=el.produit.stockReel )

                  }
                }else{
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=> el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.categorieArticleProduits.length==0 && el.produit.stockReel==0 && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=> el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.categorieArticleProduits.length==0 && el.produit.stockReel==0 )

                  }
                }
              }else{
                if(this.presquerepturestock){
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=> el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.categorieArticleProduits.length==0 &&  el.produit.stockAlert>=el.produit.stockReel && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=> el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.categorieArticleProduits.length==0 && el.produit.stockAlert>=el.produit.stockReel  )

                  }
                }else{
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=> el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.categorieArticleProduits.length==0 && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=> el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.categorieArticleProduits.length==0 )

                  }
                }
              }
            }else{
              if(this.repturedestock){
                if(this.presquerepturestock){
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=> el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.produit.stockReel==0 && el.produit.stockAlert>=el.produit.stockReel && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=> el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation)  && el.produit.stockReel==0 && el.produit.stockAlert>=el.produit.stockReel  )

                  }
                }else{
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=> el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation)  && el.produit.stockReel==0 && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=> el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation)  && el.produit.stockReel==0  )

                  }
                }
              }else{
                if(this.presquerepturestock){
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=> el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.produit.stockAlert>=el.produit.stockReel && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=> el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.produit.stockAlert>=el.produit.stockReel )

                  }
                }else{
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=> el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=> el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.produit.stockAlert>=el.produit.stockReel )
                  }
                }
              }
            }
          }else{
            if(this.notaffectedtocateg){
              if(this.repturedestock){
                if(this.presquerepturestock){
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=> el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && el.categorieArticleProduits.length==0 && el.produit.stockReel==0 && el.produit.stockAlert>=el.produit.stockReel && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=> el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && el.categorieArticleProduits.length==0 && el.produit.stockReel==0 && el.produit.stockAlert>=el.produit.stockReel )

                  }
                }else{
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=> el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && el.categorieArticleProduits.length==0 && el.produit.stockReel==0  && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=> el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && el.categorieArticleProduits.length==0 && el.produit.stockReel==0 )

                  }
                }
              }else{
                if(this.presquerepturestock){
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=> el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && el.categorieArticleProduits.length==0  && el.produit.stockAlert>=el.produit.stockReel && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=> el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && el.categorieArticleProduits.length==0 && el.produit.stockReel==0 && el.produit.stockAlert>=el.produit.stockReel && el.produit.referenceInterne!=null )

                  }
                }else{
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=> el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && el.categorieArticleProduits.length==0  && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=> el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix && el.categorieArticleProduits.length==0 )

                  }
                }
              }
            }else{
              if(this.repturedestock){
                if(this.presquerepturestock){
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=> el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix  && el.produit.stockReel==0 && el.produit.stockAlert>=el.produit.stockReel && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=> el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix  && el.produit.stockReel==0 && el.produit.stockAlert>=el.produit.stockReel )

                  }
                }else{
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=> el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix  && el.produit.stockReel==0  && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=> el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix  && el.produit.stockReel==0 )

                  }
                }
              }else{
                if(this.presquerepturestock){
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=> el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix   && el.produit.stockAlert>=el.produit.stockReel && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=> el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix  && el.produit.stockReel==0 && el.produit.stockAlert>=el.produit.stockReel && el.produit.referenceInterne!=null )

                  }
                }else{
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=> el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix   && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=> el.produit.prixTtc>this.deprix && el.produit.prixTtc<this.aprix )

                  }
                }
              }
            }
          }
        }else{
          if(this.datecreation!=null){
            if(this.notaffectedtocateg){
              if(this.repturedestock){
                if(this.presquerepturestock){
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=> el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.categorieArticleProduits.length==0 && el.produit.stockReel==0 && el.produit.stockAlert>=el.produit.stockReel && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=> el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.categorieArticleProduits.length==0 && el.produit.stockReel==0 && el.produit.stockAlert>=el.produit.stockReel )

                  }
                }else{
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=> el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.categorieArticleProduits.length==0 && el.produit.stockReel==0 && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=> el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.categorieArticleProduits.length==0 && el.produit.stockReel==0 )

                  }
                }
              }else{
                if(this.presquerepturestock){
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=> el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.categorieArticleProduits.length==0 &&  el.produit.stockAlert>=el.produit.stockReel && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=> el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.categorieArticleProduits.length==0 && el.produit.stockAlert>=el.produit.stockReel  )

                  }
                }else{
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=> el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.categorieArticleProduits.length==0 && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=> el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.categorieArticleProduits.length==0 )

                  }
                }
              }
            }else{
              if(this.repturedestock){
                if(this.presquerepturestock){
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=> el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.produit.stockReel==0 && el.produit.stockAlert>=el.produit.stockReel && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=> el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation)  && el.produit.stockReel==0 && el.produit.stockAlert>=el.produit.stockReel  )

                  }
                }else{
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=> el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation)  && el.produit.stockReel==0 && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=> el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation)  && el.produit.stockReel==0  )

                  }
                }
              }else{
                if(this.presquerepturestock){
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=> el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.produit.stockAlert>=el.produit.stockReel && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=> el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.produit.stockAlert>=el.produit.stockReel )

                  }
                }else{
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=> el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=> el.produit.prixTtc<this.aprix && this._DateService.checkdate(this.datecreation,el.produit.dateCreation) && el.produit.stockAlert>=el.produit.stockReel )
                  }
                }
              }
            }
          }else{
            if(this.notaffectedtocateg){
              if(this.repturedestock){
                if(this.presquerepturestock){
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=> el.categorieArticleProduits.length==0 && el.produit.stockReel==0 && el.produit.stockAlert>=el.produit.stockReel && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=> el.categorieArticleProduits.length==0 && el.produit.stockReel==0 && el.produit.stockAlert>=el.produit.stockReel )

                  }
                }else{
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=> el.categorieArticleProduits.length==0 && el.produit.stockReel==0  && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=> el.categorieArticleProduits.length==0 && el.produit.stockReel==0 )

                  }
                }
              }else{
                if(this.presquerepturestock){
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=> el.categorieArticleProduits.length==0  && el.produit.stockAlert>=el.produit.stockReel && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=> el.categorieArticleProduits.length==0 && el.produit.stockReel==0 && el.produit.stockAlert>=el.produit.stockReel && el.produit.referenceInterne!=null )

                  }
                }else{
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=> el.categorieArticleProduits.length==0  && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=> el.categorieArticleProduits.length==0 )

                  }
                }
              }
            }else{
              if(this.repturedestock){
                if(this.presquerepturestock){
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=> el.produit.stockReel==0 && el.produit.stockAlert>=el.produit.stockReel && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=> el.produit.stockReel==0 && el.produit.stockAlert>=el.produit.stockReel )

                  }
                }else{
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=> el.produit.stockReel==0  && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=> el.produit.stockReel==0 )

                  }
                }
              }else{
                if(this.presquerepturestock){
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=> el.produit.stockAlert>=el.produit.stockReel && el.produit.referenceInterne!=null )

                  }else{
                    this.listproduit=this.listproduit.filter(el=> el.produit.stockReel==0 && el.produit.stockAlert>=el.produit.stockReel && el.produit.referenceInterne!=null )

                  }
                }else{
                  if(this.aveccodeinterne){
                    this.listproduit=this.listproduit.filter(el=> el.produit.referenceInterne!=null )

                  }else{
                    this.annuler()

                  }
                }
              }
            }
          }
        }
      }
    }
    
  }

  
  chooseporduct(){
    console.log(this.selectedCars3);
    
    this.changePage.emit(this.selectedCars3);
  }

}
