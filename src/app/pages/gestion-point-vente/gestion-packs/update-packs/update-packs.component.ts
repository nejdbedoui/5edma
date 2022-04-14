import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProductEndPointService } from '../../../../service/bp-api-product/product-end-point/product-end-point.service';
import { Router, ActivatedRoute } from '@angular/router';
import { PointVenteEndPointService } from '../../../../service/bp-api-pos/point-vente-end-point/point-vente-end-point.service';
import { GlobalServiceService } from '../../../../service/GlobalService/global-service.service';
import { PointVente } from '../../../../model/PointVente';
import { Categorie } from '../../../../model/Categorie';
import { CategorieEndPointService } from '../../../../service/bp-api-product/categorie-end-point/categorie-end-point.service';
import { Prodcut } from '../../../../model/Product';
import { ProduitForPacks } from '../../../../model/dto/ProduitForPacks';
import { OneProduitForPacks } from '../../../../model/dto/OneProduitForPacks';
import * as uuid from 'uuid';
import { Pack } from '../../../../model/Pack';
import { Quantite } from '../../../../model/Quantite';
import { PackEndPointService } from '../../../../service/bp-api-product/pack-end-point/pack-end-point.service';

@Component({
  selector: 'ngx-update-packs',
  templateUrl: './update-packs.component.html',
  styleUrls: ['./update-packs.component.scss']
})
export class UpdatePacksComponent implements OnInit {

  constructor(private _FormBuilder:FormBuilder,private _ProductEndPointService:ProductEndPointService,
    private router:Router,private _PointVenteEndPointService:PointVenteEndPointService,
    private _GlobalServiceService:GlobalServiceService,private _CategorieEndPointService:CategorieEndPointService,
    private _PackEndPointService:PackEndPointService,
    private route:ActivatedRoute) { }
  packForm:FormGroup
  loading:boolean=true
  loading1:boolean=true
  diplay:boolean=false
  isSubmitted:boolean=false
  listpointvente:PointVente[]=[]
  cols2:any[]
  pack:Pack=new Pack()
  pvs = [
    { value: '0', label: 'Tous les Points de vente' },
    { value: '1', label: 'Certains Points de vente' }
  ];
  visible = [
    { value: 1, label: 'disponible', checked: true },
    { value: 0, label: 'Non disponible' }
  ];
  pv:string='0';
  listselectcateg:Categorie[]=[]
  categories:Categorie[]=[]
  prodcuts:Prodcut[]=[]
  produitpacks:OneProduitForPacks[]=[]
  produitpack:ProduitForPacks=new ProduitForPacks()
  id:string = this.route.snapshot.paramMap.get('id');

  ngOnInit() {
    this.cols2 = [
      { field: 'qte', header: 'qte' },
      { field: 'Nom', header: 'Nom' },
      { field: 'Action', header: 'Action' },
  ];
    this.packForm=this._FormBuilder.group({
      designation:['',[Validators.required]],
      prix:[,[Validators.required]],
      indicremise:[],
      categorie:[],
      autorisegerant:[false],
      fRacourci:[false]
    })
    this._PackEndPointService.findAllPacktByIdpartner(localStorage.getItem("partenaireid")).subscribe(pv=>{
      console.log(pv);
      this.loading=false
      if(pv.result==1){
        this.packs=pv.objectResponse
      }else{
        this.packs=[]
      }
      console.log(this.packs);
      
    }) 
    this._CategorieEndPointService.findAllCategorieByIdpartenaire(localStorage.getItem("partenaireid")).subscribe(val2=>{
      this.categories=val2.objectResponse
      this._PointVenteEndPointService.findAllByIdPartenaireBprice(localStorage.getItem("partenaireid")).subscribe(val1=>{
        this.listpointvente=val1.objectResponse
        this.listpointvente.forEach(el=>{
          el.fVisible=1
        })
        this._ProductEndPointService.findAllByPartenaire(localStorage.getItem("partenaireid")).subscribe(val=>{
          this.prodcuts=val.objectResponse     
          this._PackEndPointService.findByIdPackt(this.id).subscribe(element=>{
            console.log(element);
            this.packForm=this._FormBuilder.group({
              designation:[element.objectResponse.designation,[Validators.required]],
              prix:[element.objectResponse.prixPack,[Validators.required]],
              indicremise:[element.objectResponse.taux],
              categorie:[(this.categories!=null && this.categories.length>0 && element.objectResponse.categoriesArticles!=null && element.objectResponse.categoriesArticles.length>0)?this.categories.filter(el=>element.objectResponse.categoriesArticles.filter(val=>val==el.idCategorie).length>0 ):[]],
              autorisegerant:[element.objectResponse.fautoriseGerant==1],
              fRacourci:[element.objectResponse.fRacourci==1]
            })
            let boolvaleur:boolean=true
            this.listpointvente.forEach(el=>{
              if(element.objectResponse.pointVentes.filter(ee=>el.idPointVente==ee.idPointVente).length>0){
                el.fVisible=1
              }else{
                el.fVisible=0
                boolvaleur=false
              }
              
              
            })
            console.log(boolvaleur);
            
            if(boolvaleur){
              this.pv='0'
            }else{
              this.pv='1'
            }
            this.loading=false
            this.loading1=false
            element.objectResponse.produits.forEach(element1 => {
              let oneproduct:OneProduitForPacks=new OneProduitForPacks()
            oneproduct.prodcuts=this.prodcuts.filter(el=>el.idProduit==element1.idProduit)[0]
            oneproduct.qte=element1.quantite
            oneproduct.id=uuid.v4()
             this.produitpacks.push(oneproduct)
            });
          //  console.log(this.produitpacks);
            
            
          }) 
        })
        
      })
    })
    
    
    
  }

  get formControls() { return this.packForm.controls; }
  packs:any[]=[]
  verifproduit(){
    this.isSubmitted=true
    if(this.produitpacks==null ||this.produitpacks.length==0){
      this._GlobalServiceService.showToast("danger","Echec",'veuillez ajouter au moin un produit');
    }
    if(this.packForm.invalid || this.produitpacks==null ||this.produitpacks.length==0){
      return
    }else{
      let allproduitexist:boolean=false
      this.packs.forEach(ell=>{
        if(!allproduitexist){
          if(ell.produits.length==this.produitpacks.length){
            let allproduitexistnbr:number=0
            this.produitpacks.forEach(val=>{
            if(ell.produits.filter(element =>{
              console.log(element.idProduit);
              console.log(val.prodcuts.idProduit);
              console.log(element.quantite);
              console.log(val.qte);
              console.log(element.idProduit==val.prodcuts.idProduit && element.quantite==val.qte);
              if(element.idProduit==val.prodcuts.idProduit && element.quantite==val.qte && ell.idPack!=this.id){
                return true;
              }else{
                return false;
              }
            } ).length>0){
              allproduitexistnbr++
            }
          })
          console.log(allproduitexistnbr);
          
          if(allproduitexistnbr==ell.produits.length){
            allproduitexist=true
            return;
          }
          }
        }
    })
    console.log(allproduitexist);
    
    if(allproduitexist){
      this._GlobalServiceService.showToast("danger","Echec",'les produits sont les meme dans un autre pack');

    }else{
      let nbrprix:number=0;
      
      this.produitpacks.forEach(val=>{
        nbrprix=nbrprix+val.prodcuts.prixTtc*val.qte
      })
      if(nbrprix>=this.packForm.value.prix){
        this.createpack()
        console.log("creation");
        
      }else{
        this._GlobalServiceService.showToast("danger","Echec",'le prix du pack est inférieure au prix des produits');
      }
    }

    }
  }

  createpack(){
    this.isSubmitted=true
    if(this.produitpacks==null ||this.produitpacks.length==0){
      this._GlobalServiceService.showToast("danger","Echec",'veuillez ajouter au moin un produit');
    }
    if(this.packForm.invalid || this.produitpacks==null ||this.produitpacks.length==0){
      return
    }else{
      console.log(this.packForm.value);
      console.log(this.listpointvente);
      
      console.log(this.produitpacks);
      this.pack.dateCreation=new Date()
      this.pack.designation=this.packForm.value.designation
      this.pack.prixPack=this.packForm.value.prix
      this.pack.taux=this.packForm.value.indicremise
      this.pack.pointVentes=this.listpointvente.filter(el=>el.fVisible==1)
      this.pack.fautoriseGerant=this.packForm.value.autorisegerant?1:0
      this.pack.produits=[]
      this.pack.idPack=this.id
      this.pack.fRacourci=this.packForm.value.fRacourci?1:0
      this.pack.categoriesArticles=[]
      if(this.packForm.value.categorie!=null){
        this.packForm.value.categorie.forEach(element => {        
          this.pack.categoriesArticles.push(element.idCategorie)
        });
      }
      
      this.pack.idPartenaire=localStorage.getItem("partenaireid")
      this.produitpacks.forEach(val=>{
        let quantite:Quantite=new Quantite()
        quantite.idProduit=val.prodcuts.idProduit
        quantite.quantite=val.qte
        this.pack.produits.push(quantite)
      })
      this.loading=true
      console.log(this.pack);
      this._PackEndPointService.createPack(this.pack).subscribe(val=>{
        if (val.result == 1 ){
          this._GlobalServiceService.showToast("success","Succès",'le Pack est modifié avec succès');
          this.isSubmitted = false;
          this.loading=false
          this.router.navigateByUrl("/pages/Pointvente/gestionPacks")
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
  qteeereur:boolean=false
  prodcutserreur:boolean=false
  videproduit:boolean=true
  diplayproduit:boolean=false
  addproduit(){
    if(this.produitpack.qte==null || this.produitpack.qte<=0){
      this.qteeereur=true
    }else{
      this.qteeereur=false
    }
    if(this.produitpack.prodcuts==null || this.produitpack.prodcuts.length==0 ){
      this.prodcutserreur=true
    }else{
      this.prodcutserreur=false
    }
    if(!this.qteeereur && !this.prodcutserreur){
      console.log(this.produitpack.prodcuts);
      this.produitpack.prodcuts.forEach(el=>{
        if(this.produitpacks.filter(val=>val.prodcuts.idProduit==el.idProduit).length>0){
          this._GlobalServiceService.showToast('danger',"Echec","le Produit"+el.designation+" a été déja sélectionner");
        }else{
          let produitpacks:OneProduitForPacks=new OneProduitForPacks()
          produitpacks.qte=this.produitpack.qte
          produitpacks.prodcuts=el
          produitpacks.id=uuid.v4()
          this.produitpacks.push(produitpacks)
          
        }

      })
      this.produitpack=new ProduitForPacks()

      
    }
  }
  currentproduitpacks:OneProduitForPacks=new OneProduitForPacks()
  addqte(produitpacks:OneProduitForPacks){
    produitpacks.qte++
  }
  rmoveqte(produitpacks:OneProduitForPacks){
    if(produitpacks.qte!=1){
      produitpacks.qte--
    }
  }

  delteproduit(){
    this.produitpacks=this.produitpacks.filter(val=>val.prodcuts.idProduit!=this.currentproduitpacks.prodcuts.idProduit)
    this.diplay=false
  }

  test:boolean=true
  onChangeproduit(products: Array<any>){
    this.produitpack.prodcuts.push(this.prodcuts[0])

    console.log(this.produitpack);
    products.forEach(el=>{
      if(this.produitpacks.filter(val=>val.prodcuts.idProduit==el.produit.idProduit).length>0){
        this._GlobalServiceService.showToast('danger',"Echec","le Produit"+el.designation+" a été déja sélectionner");
      }else{
        let produitpacks:OneProduitForPacks=new OneProduitForPacks()
        produitpacks.qte=1
        produitpacks.prodcuts=el.produit
        produitpacks.id=uuid.v4()
        this.produitpacks.push(produitpacks)
        
      }

    })
    this.diplayproduit=false
    
  }
}
