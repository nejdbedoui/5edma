import { Component, OnInit, ViewChild } from '@angular/core';
import {CategorieEndPointService} from "../../../../service/bp-api-product/categorie-end-point/categorie-end-point.service";
import { Categorie } from '../../../../model/Categorie';
import {environment} from "../../../../../environments/environment";
import {Prodcut} from "../../../../model/Product";
import {FormBuilder, FormGroup, Validators, FormArray} from "@angular/forms";
import {ProductEndPointService} from "../../../../service/bp-api-product/product-end-point/product-end-point.service";
import {NbComponentStatus, NbToastrService} from "@nebular/theme";
import { PointVenteEndPointService } from '../../../../service/bp-api-pos/point-vente-end-point/point-vente-end-point.service';
import { PointVente } from '../../../../model/PointVente';
import { GlobalServiceService } from '../../../../service/GlobalService/global-service.service';
import { ProductCategorieArticleidDto } from '../../../../model/dto/ProductCategorieArticleidDto';
import { Router } from '@angular/router';
import { FournisseurDto } from '../../../../model/dto/FournisseurDto';
import { TreeNode } from 'primeng/components/common/treenode';
import { Productsdto } from '../../../../model/dto/Productsdto';
import { PointVentespriceDto } from '../../../../model/dto/PointVentespriceDto';
import { Fournisseur } from '../../../../model/dto/Fournisseur';
import * as uuid from 'uuid';
import { FournisseurEndPointService } from '../../../../service/bp-api-product/fournisseur-end-point/fournisseur-end-point.service';
import { FileEndPointService } from '../../../../service/bp-api-admin/file-end-point/file-end-point.service';
import { Ingredient } from '../../../../model/Ingredient';
import { PrimaryProduction } from '../../../../model/PrimaryProduction';
import { Famille } from '../../../../model/Famille';

@Component({
  selector: 'ngx-create-produit',
  templateUrl: './create-produit.component.html',
  styleUrls: ['./create-produit.component.scss']
})
export class CreateProduitComponent implements OnInit {

  articleTypes=[{label:'Stockable',value:'stockable'},{label:'Consommable',value:'consommable'},{label:'Service',value:'service'}];
  coutTypes=[{label:'KG',value:'KG'},{label:'litre',value:'litre'},{label:'unit??',value:'unit??'},{label:'plat pr??par?? ',value:'plat pr??par?? '}];
  pvs = [
    { value: '0', label: 'appliquer ?? tous les points de ventes' },
    { value: '1', label: 'appliquer ?? certains  points de ventes' }
  ];
  visible = [
    { value: 1, label: 'm??me prix', checked: true },
    { value: 0, label: 'autre prix' }
  ];
  cols2:any[]
  pv:string='0';
  pointVenteId:string = localStorage.getItem('pointventeid');
  articalCategories:any[]=[];
  loading:boolean=false
  file:string=""
  image: any;
  files:File;
  imagename:string;
  product:Prodcut = new Prodcut();
  productForm:FormGroup;
  isSubmitted:boolean = false;
  isSubmitted2:boolean = false;
  connectedUser:string = localStorage.getItem('UserId');
  partenaireId:string = localStorage.getItem('partenaireid');
  status: NbComponentStatus = 'success';
  gestionstock:boolean=false
  gestionfournisseur:boolean=false
  public color: string;
  pointvente:PointVente=new PointVente()
  listpointvente:PointVente[]=[]
  fournisseurDto:FournisseurDto=new FournisseurDto()
  listfournisseur:FournisseurDto[]=[]
  listcategorieschecked:any[]=[]
  items: FormArray;
  subitems: FormGroup;
  selectedFiles2: TreeNode[]=[];
  filesTree4:TreeNode[]=[];
  diplayaddfourni:boolean=false
  diplaydeletefourni:boolean=false
  familles:Famille[]=[]
  public placeholder: string = "nom"  ;
  public keyword = 'nom';
  uuids=uuid.v4()
  @ViewChild('ngAutoCompleteStatic',{static:false}) auto;
  constructor(private _CategorieEndPointService:CategorieEndPointService,private _FormBuilder: FormBuilder,private _ProductEndPointService:ProductEndPointService,
    private toastrService: NbToastrService,private _PointVenteEndPoint:PointVenteEndPointService,
    private _GlobalService:GlobalServiceService,private _FournisseurEndPointService:FournisseurEndPointService,
    private router:Router,private _FileEndPointService:FileEndPointService) { }
    
  getFamilles(){
    this._ProductEndPointService.findAllFamilleByPartenaire(localStorage.getItem("partenaireid")).subscribe(val=>{
      if(val.result==1){
        this.familles=val.objectResponse
      }
      this.loading=false;
    })
  }  
  ngOnInit() {
    this.cols2 = [
      { field: 'Nom', header: 'Nom' },
      { field: 'Soci??t??', header: 'Soci??t??' },
      { field: 'Principal', header: 'Principal' },
      { field: 'Action', header: 'Action' },
  ];
  this.getPrimaryProducts();
  this.getingredients();
  this.getFamilles();
  this._FournisseurEndPointService.findAllByIdPatenaireBprice(localStorage.getItem("partenaireid")).subscribe(val=>{
    this.listfourni=val.objectResponse!=null?val.objectResponse:[]
  })
    this._CategorieEndPointService.findAllCategorieByIdpartenaire(localStorage.getItem("partenaireid")).subscribe(res => {
      console.log(res);
      if (res.result == 1){
        this.articalCategories = res.objectResponse;
        this.articalCategories.forEach(categorie=>{
          let treenode:TreeNode={
            "label": categorie.designation,
            "data": categorie.idCategorie,
            "expandedIcon": "pi pi-folder-open",
            "collapsedIcon": "pi pi-th-large",
          };
          treenode.expanded=true
          let fils:any[]=[]
          let child:TreeNode[]=[]
          fils=categorie.fils
           treenode.children=[]
          // child=treenode.children
          
          this.recursive(treenode,categorie.fils)
          this.filesTree4.push(treenode)
        })
      }
    });
    this._PointVenteEndPoint.findAllByIdPartenaireBprice(localStorage.getItem("partenaireid")).subscribe(val=>{
      this.listpointvente=val.objectResponse
      this.listpointvente.forEach(el=>{
        el.fVisible=1
      })
    })
    // this._PointVenteEndPoint.findPointVenteByIdPointVente(localStorage.getItem("pointventeid")).subscribe(res=>{
    //   this.pointvente=res.objectResponse
    //   console.log(this.pointvente);
      
    // })
    this.productForm = this._FormBuilder.group({
      idArtCateg:[],
      designation:[,[Validators.required]],
      description:[],
      referenceInterne:[],
      prixHt:[],
      prixTtc:[0,[Validators.required]],
      typeProduit:[],
      codeBarre:[],
      fVendu:[false],
      fAchete:[false],
      fSaisirp:[false],
      TVA:[],
      taxe:[],
      finfodetails:[false],
      fRacourci:[false],
      coutTypes:[],
      cout:[],
      fpv:[false],
      fbalance:[false],
      stockReel:[],
      valeur:[],
      mesure:[],
      alertestock:[],
      qte:[],
      codeBarreinterne:[],
      fmdifprix:[false],
      fcodebare:[false],
      fMobile:[false],
      fPrimaire:[false],
      fSuppliment:[false],
      ingredients:[],
      famille:[],
      items: this._FormBuilder.array([])
    })
    this.items= this.productForm.get('items') as FormArray;
    this.addItem();
  }
  diplaystock:boolean=false
  onEventLog(evnt,evnt2){
    this.color=evnt2.color
  }
  get itemForms() {
    return this.productForm.get('items') as FormArray;
  }
  ingredients:Ingredient[]=[]
  selectIngredient(event){

  }
  primaryProducts:Prodcut[]=[]
  getPrimaryProducts(){
    this._ProductEndPointService.findAllByIdPartenaireAndFPrimaire(localStorage.getItem("partenaireid"),1).subscribe(val=>{
      console.log(val);
      
      if(val.result==1){
        this.primaryProducts=val.objectResponse
      }
    })
  }

  getingredients(){
    this._ProductEndPointService.findAllIngredientByPartenaire(localStorage.getItem("partenaireid")).subscribe(val=>{
      if(val.result==1){
        this.ingredients=val.objectResponse
      }
      this.loading=false;
    })
  }
  
  createItem(): FormGroup {
    return this._FormBuilder.group({
      cata:[''],
      subitems: this._FormBuilder.group({})
    });
  }

  addItem(): void {
    this.items.push(this.createItem());
  }

  
  // get subitemForms() {
  //   return this.productForm.get('subitems') as FormArray;
  // }
  
  subcreateItem(): FormGroup {
    return this._FormBuilder.group({
      cata:[''],
      subitems: this._FormBuilder.group([])
    });
  }

  subaddItem(index): void {
    // let vel=this.itemForms.value
    // this.itemForms.controls
    this.itemForms.value[index].subitems=(this.createItem());
    console.log(this.itemForms.value);
    
    //this.items.push(this.createItem());
  }

  onFileChange(ev) {
    console.log(ev.target.files[0]);
    if(ev.target.files[0]!=null){
      this.files = ev.target.files[0];
      if(this.files.name.toLocaleLowerCase().endsWith(".png")||this.files.name.toLocaleLowerCase().endsWith(".jpg")||this.files.name.toLocaleLowerCase().endsWith(".gif")||this.files.name.toLocaleLowerCase().endsWith(".jpeg")){
        let name:String="";
        name=this.files.name;
        console.log(name);
  
        name=name.replace(" ","_");
        name.split(" ").forEach(vam=>{
          name=name.replace(' ',"_");
        })
        this.imagename=environment.image_url+"/" + this.uuids+name
        const reader = new FileReader();
        reader.onload = () => {
          this.image = reader.result;
        }
        reader.readAsDataURL(this.files);
      }else{
  
      }
    }


  }
  get formControls() { return this.productForm.controls; }
  annulerstock(){

  }

  recursive(parent,fils){
    // while(false && fils!=null && fils.length>0){      
      fils.forEach(ch=>{
        let treenodechild:TreeNode={
          "label": ch.designation,
          "data": ch.idCategorie,
          "collapsedIcon": "pi pi-th-large",
        };
        treenodechild.expanded=true
        if(parent.children==null)
          parent.children=[]
        parent.children.push(treenodechild);        
        this.recursive(treenodechild,ch.fils)
      })
    // }
  }
  diplayproduit:boolean=false
  createProductbeforeverif(){
    this.isSubmitted = true;
    console.log(this.productForm);
    
     if (this.productForm.invalid || (this.gestionstock && (
       this.productForm.value.mesure==null ||this.productForm.value.mesure==""  || this.productForm.value.alertestock==null || this.productForm.value.qte==null 
       ))){
       console.log('error');
     }else {
       if(this.productForm.value.prixTtc==0){
        this.diplayproduit=true
       }else{
         this.createProduct()
       }
     }
  }
  selectedIngred:Ingredient[]=[]
  selectedProduct:Prodcut[]=[]
  selectedProducts:PrimaryProduction[]=[]
  addqte(produitpacks:PrimaryProduction){
    produitpacks.quantity++
  }
  rmoveqte(produitpacks:PrimaryProduction){
    if(produitpacks.quantity!=1){
      produitpacks.quantity--
    }
  }
  currentproduit:PrimaryProduction=new PrimaryProduction();
  diplay:boolean=false;
  deleteComposition(){
    this.selectedProducts=this.selectedProducts.filter(el=>el.idProduit!=this.currentproduit.idProduit)
    this.selectedProduct=this.selectedProduct.filter(el=>el.idProduit!=this.currentproduit.idProduit)
  }
  selectPrimaryProdut($event){
    this.selectedProducts=[]
    $event.forEach(element => {
      let selectedProduct:PrimaryProduction=new PrimaryProduction();
    selectedProduct.quantity=1
    selectedProduct.idProduit=element.idProduit
    selectedProduct.produit=element
    this.selectedProducts.push(selectedProduct)
    });
    
  }

  createProduct(){
    this.isSubmitted = true;
   console.log(this.productForm);
   
    if (this.productForm.invalid || (this.gestionstock && (
      this.productForm.value.mesure==null ||this.productForm.value.mesure==""  || this.productForm.value.alertestock==null  || this.productForm.value.qte==null 
      ))){
      console.log('error');
    }else {
      this.loading=true
      console.log(this.productForm.value);
      console.log('ok');
      let produtcate:ProductCategorieArticleidDto=new ProductCategorieArticleidDto()
      //this.product = this.productForm.value;
      this.product.ajoutePar = this.connectedUser;
      this.product.idPartenaire = this.partenaireId;
      this.product.fAchete = this.productForm.value.fAchete== true?1:0;
      this.product.fVendu= this.productForm.value.fVendu== true?1:0;
      this.product.codeBarre= this.productForm.value.codeBarre
      this.product.dateCreation= new Date()
      this.product.fRacourci= this.productForm.value.fRacourci==true?1:0;
      this.product.prixHt=this.productForm.value.prixHt!=null?this.productForm.value.prixHt.toFixed(2):this.productForm.value.prixHt;
      this.product.prixTtc= this.productForm.value.prixTtc!=null?this.productForm.value.prixTtc.toFixed(2):this.productForm.value.prixTtc;
      this.product.referenceInterne= this.productForm.value.referenceInterne
      this.product.stockReel= this.productForm.value.stockReel==null?0:this.productForm.value.stockReel
      this.product.typeProduit=this.gestionstock? "stockable":"service"
      this.product.urlImg=this.files!=null?this.imagename:null
      this.product.description=this.productForm.value.description
      this.product.designation=this.productForm.value.designation
      this.product.couleur=this.color
      this.product.code=this.product.designation.toLocaleUpperCase()
      this.product.mesure=this.productForm.value.mesure
      this.product.fautorisGerant=this.productForm.value.fmdifprix?1:0
      this.product.fMobile=this.productForm.value.fMobile?1:0
      this.product.fPrimaire=this.productForm.value.fPrimaire?1:0
      this.product.fSuppliment=this.productForm.value.fSuppliment?1:0
      this.product.stockAlert=this.productForm.value.alertestock
      this.product.stockQteDepart=this.productForm.value.qte
      this.product.tva=this.productForm.value.TVA
      this.product.referenceInterne= this.productForm.value.fcodebare?this.productForm.value.codeBarreinterne:null
      this.product.primaryProduction=this.selectedProducts;
      // this.product.ingredients=!this.gestionstock?this.productForm.value.ingredients:[]
      this.product.ingredients=!this.gestionstock?this.selectedIngred:[]
      this.product.famille=this.productForm.value.famille
      produtcate.produit=this.product
      // console.log( this.product);
      // console.log(this.listfournisseur);
      // console.log(this.listpointvente);
      // console.log(this.listcategorieschecked);
      // console.log(this.selectedFiles2);
      let productsdto:Productsdto=new Productsdto()
      productsdto.produit=this.product
      productsdto.fournisseurs=[]
      this.listfournisseur.forEach(fourinsseur=>{
        let fourn:Fournisseur=new Fournisseur()
        fourn.email=fourinsseur.email
        fourn.idFournisseur=fourinsseur.isnew?null:fourinsseur.id
        fourn.fdefaut=fourinsseur.fdefault?1:0
        fourn.fAlerte=fourinsseur.falerter?1:0
        fourn.nom=fourinsseur.nom
        fourn.societe=fourinsseur.societe
        fourn.tel=fourinsseur.tel
        fourn.idPatenaireBprice=this.partenaireId
        productsdto.fournisseurs.push(fourn)
      })
      productsdto.catgorieids=[]
      productsdto.pointVentes=[]
      console.log(this.selectedFiles2);
      
      this.selectedFiles2.forEach(element => {
        if(element.children==null || element.children.length==0){
          productsdto.catgorieids.push(element.data)
        }
      }); 
      this.listpointvente.forEach(pv=>{
        let pointVente:PointVentespriceDto=new PointVentespriceDto()
        pointVente.idpointvente=pv.idPointVente
        if(pv.fVisible){
          pointVente.price=this.product.prixTtc
        }else{
          pointVente.price=pv.prixpv!=null?pv.prixpv:this.product.prixTtc
        }
        pointVente.visible=pv.fVisible?1:0
        productsdto.pointVentes.push(pointVente)
      })
      console.log(productsdto);
      
      let catgoryarticleid:string[]=[]
      
      this._ProductEndPointService.createProductwithaffectation(productsdto ).subscribe(res => {
        console.log(res);
        if (res.result == 1 ){
          if(this.files!=null){
            this._FileEndPointService.uplodeimage(this.files,this.uuids).subscribe(vel=>{
              console.log(vel);
              
            })
          }
          this.showToast(this.status,"Succ??s",'Produit cr??e avec succ??s');
          this.isSubmitted = false;
          this.loading=false
          this.router.navigateByUrl("/pages/Pointvente/gestionProduit")
         // this.productForm.reset();
        }else{
          this.showToast('danger',"Echec",res.errorDescription);
           this.loading=false
        }
      },erreur=>{
        this.showToast('danger',"Echec",erreur);
        this.loading=false
      });
    }
  }
  private showToast(type:NbComponentStatus, title: string, body: string) {
    const config = {
      status: type,

    };
    const titleContent = title ? `${title}` : '';

    this.toastrService.show(
      body,
      `${titleContent}`,
      config);


  }
  isSubmitfournisseur:boolean=false
  isnamevalid:boolean=false
  istelvalid:boolean=false
  isemailvalid:boolean=false
  addfourinsseur(){
    this.isSubmitfournisseur=true
    if(this.fournisseurDto.tel==null || this.fournisseurDto.tel==''){
      this.istelvalid=true
    }else{
      this.istelvalid=false
    }
    if(this.fournisseurDto.nom==null || this.fournisseurDto.nom==''){
    this.isnamevalid=true
    }else{
      this.isnamevalid=false
    }
    var EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    console.log(EMAIL_REGEXP.test(this.fournisseurDto.email));
    
    if((this.fournisseurDto.email!=null && this.fournisseurDto.email!='') && !EMAIL_REGEXP.test(this.fournisseurDto.email)){
      this.isemailvalid=true
      }else{
        this.isemailvalid=false
      }
      if(!this.istelvalid && !this.isnamevalid &&  !this.isemailvalid){
      
      if(this.listfournisseur.filter(el=>el.id==this.fournisseurDto.id).length>0){
        this.showToast('danger',"Echec","ce Fournisseur a ??t?? d??ja s??lectionner");
      }else{
        let fourin:FournisseurDto=new FournisseurDto()
        fourin.nom=this.fournisseurDto.nom
        fourin.societe=this.fournisseurDto.societe
        fourin.tel=this.fournisseurDto.tel
        fourin.email=this.fournisseurDto.email
        fourin.falerter=this.fournisseurDto.falerter
        fourin.fdefault=this.fournisseurDto.fdefault
        if(this.fournisseurDto.id!=null){
         fourin.id=this.fournisseurDto.id
         fourin.isnew=false
        }else{
         fourin.id=uuid.v4()
         fourin.isnew=true
        }
        console.log(fourin);
         this.listfournisseur.push(fourin)
         this.cleardata()
         this.auto.clear();
         this.fournisseurDto=new FournisseurDto()
      }

      
    }
  }
  isnamevalid2:boolean=false
  istelvalid2:boolean=false
  isemailvalid2:boolean=false
  isSubmitfournisseur2:boolean=false
  addfourinsseur2(){
    this.isSubmitfournisseur2=true
    if(this.currentfourni.tel==null || this.currentfourni.tel==''){
      this.istelvalid2=true
    }else{
      this.istelvalid2=false
    }
    if(this.currentfourni.nom==null || this.currentfourni.nom==''){
    this.isnamevalid2=true
    }else{
      this.isnamevalid2=false
    }
    var EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    console.log(EMAIL_REGEXP.test(this.currentfourni.email));
    
    if((this.currentfourni.email!=null && this.currentfourni.email!='') && !EMAIL_REGEXP.test(this.currentfourni.email)){
      this.isemailvalid2=true
      }else{
        this.isemailvalid2=false
      }
      if(!this.istelvalid2 && !this.isnamevalid2 &&  !this.isemailvalid2){
        let fourin:FournisseurDto=new FournisseurDto()
        if(this.currentfourni.isnew){
          fourin.nom=this.currentfourni.nom
          fourin.societe=this.currentfourni.societe
          fourin.tel=this.currentfourni.tel
          fourin.email=this.currentfourni.email
          fourin.falerter=this.currentfourni.falerter
          fourin.fdefault=this.currentfourni.fdefault
          fourin.id=uuid.v4()
          fourin.isnew=true
        }else{
          fourin=this.currentfourni
          fourin.falerter=this.currentfourni.falerter
          fourin.fdefault=this.currentfourni.fdefault        
        }
        this.deletefourn(this.currentfourni)
        this.listfournisseur.push(fourin)
        this.fournisseurDto=new FournisseurDto()
         this.diplayaddfourni=false
      }
      
     
  }
  
  annuler(){
    this.router.navigateByUrl("/pages/Pointvente/gestionProduit")
  }

  onChange(event,index){
    console.log(event);
    console.log(this.itemForms.value[0].subitems);
    this.subaddItem(index)
  }

  deletefourn(fourni){
    this.listfournisseur=this.listfournisseur.filter(el=>el.id!=fourni.id)
  }

  currentfourni:FournisseurDto=new FournisseurDto()
  editsfourni(fourin){
    this.diplayaddfourni=true
    this.currentfourni.nom=fourin.nom
    this.currentfourni.societe=fourin.societe
    this.currentfourni.tel=fourin.tel
    this.currentfourni.email=fourin.email
    this.currentfourni.falerter=fourin.falerter
    this.currentfourni.fdefault=fourin.fdefault
    this.currentfourni.id=fourin.id
    this.currentfourni.isnew=fourin.isnew
  }
  deltefourni(fourin){
    this.diplaydeletefourni=true
    this.currentfourni=fourin

  }

  autocomp:boolean=false
  listfourni:Fournisseur[]=[]
  selectEvent(item:Fournisseur){
    console.log(item);
    this.fournisseurDto.nom=item.nom
    this.fournisseurDto.societe=item.societe
    this.fournisseurDto.tel=item.tel
    this.fournisseurDto.email=item.email
    this.fournisseurDto.falerter=false
    this.fournisseurDto.fdefault=item.fdefaut==1
    this.fournisseurDto.id=item.idFournisseur
    this.autocomp=true
  }
  onChangeSearch(event){
    console.log(event);
    
    if(event!=null){
      this.fournisseurDto.nom=event
    }
    console.log(this.fournisseurDto);
    
    this.autocomp=false
  }
  cleardata(){
    this.fournisseurDto=new FournisseurDto()
    this.autocomp=false
    
  }
}
