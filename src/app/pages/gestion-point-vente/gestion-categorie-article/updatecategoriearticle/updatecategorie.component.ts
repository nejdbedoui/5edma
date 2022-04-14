import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ProductEndPointService } from '../../../../service/bp-api-product/product-end-point/product-end-point.service';
import { CategorieEndPointService } from '../../../../service/bp-api-product/categorie-end-point/categorie-end-point.service';
import { NbToastrService, NbComponentStatus } from '@nebular/theme';
import { Router, ActivatedRoute } from '@angular/router';
import { Prodcut } from '../../../../model/Product';
import { Categorie } from '../../../../model/Categorie';
import { environment } from '../../../../../environments/environment';
import { categoryProductDto } from '../../../../model/dto/categoryProductDto';
import { CategoryArticleProductDto } from '../../../../model/dto/CategoryArticleProductDto';
import { ProduitDto } from '../../../../model/dto/ProduitDto';
import { CategorieDto } from '../../../../model/dto/CategorieDto';
import { PointVenteEndPointService } from '../../../../service/bp-api-pos/point-vente-end-point/point-vente-end-point.service';
import { GlobalServiceService } from '../../../../service/GlobalService/global-service.service';
import { PointVente } from '../../../../model/PointVente';
import { TreeNode } from 'primeng/components/common/treenode';
import { PointVentevisible } from '../../../../model/dto/PointVentevisible';
import { filter } from 'rxjs/operators';
import { FileEndPointService } from '../../../../service/bp-api-admin/file-end-point/file-end-point.service';
import * as uuid from 'uuid';

@Component({
  selector: 'ngx-updatecategorie',
  templateUrl: './updatecategorie.component.html',
  styleUrls: ['./updatecategorie.component.scss']
})
export class UpdatecategorieComponent implements OnInit {
  interval:any


  id:string = this.route.snapshot.paramMap.get('id');
  constructor(private _FormBuilder:FormBuilder,private _ProductEndPointService:ProductEndPointService,
    private _CategorieEndPointService:CategorieEndPointService,private toastrService: NbToastrService,private router:Router,
    private _PointVenteEndPointService:PointVenteEndPointService,private _GlobalServiceService:GlobalServiceService,private route:ActivatedRoute,
    private _FileEndPointService:FileEndPointService) { }
  iscategorieFormSubmitted:boolean=false
  categorieForm:FormGroup
  file:File
  products:Prodcut[]=[]
  categories:Categorie[]=[]
  diplay:boolean=false
  exist:boolean=false
  listproduit:ProduitDto[]=[]
  listcateogrie:Categorie[]=[]
  listpointvente:PointVente[]=[]
  categoryArticleProductDtos:CategoryArticleProductDto[]=[]
  produitDtos:ProduitDto[]=[]
  cols:any[]
  desi:string=null
  orderForm: FormGroup;
  items: FormArray;
  loading:boolean=true
  color:string
  globalproduit:boolean=false
  uuids=uuid.v4()
  pvs = [
    { value: '0', label: 'Tous les Points de vente' },
    { value: '1', label: 'Certains Points de vente' }
  ];
  visible = [
    { value: 1, label: 'Visible', checked: true },
    { value: 0, label: 'Non visible' }
  ];
  pv:string='0';
  selectedCars3: ProduitDto[];
  filesTree0: TreeNode[];
  ngOnInit() {

    this.orderForm = this._FormBuilder.group({
      items: this._FormBuilder.array([])
    });

    this.cols = [
      { field: 'Désignation', header: 'Désignation' },
      { field: 'Code', header: 'Code' },
      { field: 'DateCreation', header: 'DateCreation' },
      { field: 'Action', header: 'Action' }

  ];
    this.categorieForm=this._FormBuilder.group({
      designation:['',[Validators.required]],
      categoriemere:[],
      description:[],
      actif:[true],
      fMobile:[true],
      idcata:[],
      order:[]
    })
    
    console.log(this.categorieForm.controls['designation']);
    
    this.filesTree0=[{
      "label": this.categorieForm.controls['designation'].value,
      "data": this.categorieForm.value,
      "expandedIcon": "pi pi-folder-open",
      "collapsedIcon": "pi pi-th-large",
      "children": [
        // {
        //       "label": "Al Pacino",
        //       "data": "Pacino Movies",
        //   }
          ]
  }]
    this._PointVenteEndPointService.findAllByIdPartenaireBprice(localStorage.getItem("partenaireid")).subscribe(val=>{
      this.listpointvente=val.objectResponse
      this.listpointvente.forEach(el=>{
        el.fVisible=1

      })
      this._ProductEndPointService.findAllByPartenaire(localStorage.getItem("partenaireid")).subscribe(val=>{
        if(val.result==1){
          this.listproduit=val.objectResponse
          this.listproduit.forEach(vall=>{
            let produitDto:ProduitDto=new ProduitDto()
            produitDto=vall
            produitDto.isActif=false
            this.produitDtos.push(produitDto)
          })
        }else{
          this.listproduit=[]
        }
        this._CategorieEndPointService.findAllCategoriesbyidcategorie(this.id).subscribe(cata=>{
          console.log(cata);
          this.loading=false
          this.categorieForm=this._FormBuilder.group({
            designation:[cata.objectResponse.categorieArticle.designation,[Validators.required]],
            categoriemere:[cata.objectResponse.categorieArticle.idCetgorieMere],
            description:[cata.objectResponse.categorieArticle.description],
            actif:[cata.objectResponse.categorieArticle.fActif==1],
            fMobile:[cata.objectResponse.categorieArticle.fMobile==1],
            idcata:[cata.objectResponse.categorieArticle.idCategorie],
            order:[cata.objectResponse.categorieArticle.order],
          })
          this.image=cata.objectResponse.categorieArticle.photo
          this.color=cata.objectResponse.categorieArticle.couleur
          this.filesTree0[0].label=this.categorieForm.controls['designation'].value
          this.listproduit.forEach(val=>{
            let produit2=cata.objectResponse.produits!=null?cata.objectResponse.produits.filter(el=>el.idProduit==val.idProduit):[]
            val.isActif=produit2.length>0?true:false
            if(val.isActif){
              this.globalproduit=true
            }
          })
          this.listpointvente.forEach(el=>{
            el.fVisible=cata.objectResponse.pointVenteVisibiles.length>0?cata.objectResponse.pointVenteVisibiles.filter(val=>el.idPointVente==val.idPointVente)[0].fVisible:1
    
          })
          this.pv=this.countvaleur(this.listpointvente)?'1':'0'
          cata.objectResponse.fils.forEach(element => {
            console.log(element);
            
            let list:PointVente[]=[]
            if(element.pointVenteVisibiles!=null){
              element.pointVenteVisibiles.forEach(val=>{
                let pv:PointVente=new PointVente()
                pv.idPointVente=val.idPointVente
                pv.fVisible=val.fVisible
                pv.designation=this.listpointvente.filter(el=>el.idPointVente==val.idPointVente)[0].designation
                list.push(pv)
              })
            }
            
        let listp:ProduitDto[]=[]
        this.listproduit.forEach(val=>{
          let produit:ProduitDto=new ProduitDto()
          produit.idProduit=val.idProduit
          produit.code=val.code
          produit.dateCreation=val.dateCreation
          produit.designation=val.designation
          let produit2=element.produits!=null?element.produits.filter(el=>el.idProduit==val.idProduit):[]
          produit.isActif=produit2.length>0?true:false
          listp.push(produit)
        })
              
        let selectedCars3: any[];
        let visible2 = [
          { value: 1, label: 'Visible', checked: true },
          { value: 0, label: 'Non visible' }
        ];
       let pvs2 = [
          { value: '0', label: 'Tous les Points de vente' },
          { value: '1', label: 'Certains Points de vente' }
        ];
        console.log(element.produits!=null?element.produits.length>0:false);
        
        const phone = this._FormBuilder.group({ 
          designation1:[element.categorieArticle.designation,[Validators.required]],
          categoriemere1:[element.categorieArticle.idCetgorieMere],
          description1:[element.categorieArticle.description],
          idcata:[element.categorieArticle.idCategorie],
          listpvs1:[list],
          categorieexistante:[],
          islistcategie:[false],
          allpv:[this.countvaleur(element.pointVenteVisibiles)?pvs2[1].value:pvs2[0].value],
          radio:[visible2],
          pvradio:[pvs2],
          actif1:[element.categorieArticle.fActif],
          fMobile1:[element.categorieArticle.fMobile1],
          chooseproduit:[element.produits!=null?element.produits.length>0:false],
          products:[listp],
          color:[element.categorieArticle.couleur]
        })
        this.filesTree0[0].expanded=true
        this.filesTree0[0].children.push(
          {
                "label": phone.controls['designation1'].value,
                "data": "",
                "collapsedIcon": "pi pi-list",
            }
        )
        this.itemForms.push(phone);
          });
          
        })
      },err=>{
        this.listproduit=[]
      })
    })
    this._CategorieEndPointService.findAllCategorieByIdpartenaire(localStorage.getItem("partenaireid")).subscribe(val=>{
      
      this.categories=val.objectResponse
    })
   
  }

  countvaleur(allpv:PointVente[]){
    return allpv.filter(val=>val.fVisible==0).length>0
  }
  onKey(event){    
    this.filesTree0[0].label=this.categorieForm.controls['designation'].value
  }
  onKeychild(index){    
    console.log(this.itemForms.value[index].designation1);
    
    this.filesTree0[0].children[index].label=this.itemForms.value[index].designation1
  }
  createItem(): FormGroup {
    return this._FormBuilder.group({
      designation1:['',[Validators.required]],
      categoriemere1:[],
      description1:[],
      actif1:[true],
      fMobile1:[true]
    });
  }
  get itemForms() {
    return this.orderForm.get('items') as FormArray;
  }
  option:any="0";
  
  addItem(exist:boolean): void {
    // this.items = this.orderForm.get('items') as FormArray;
    // this.items.push(this.createItem());
    let list:PointVente[]=[]
    this.listpointvente.forEach(val=>{
      let pv:PointVente=new PointVente()
      pv.idPointVente=val.idPointVente
      pv.fVisible=1
      pv.designation=val.designation
      list.push(pv)
    })
    let listp:ProduitDto[]=[]
    this.listproduit.forEach(val=>{
      let produit:ProduitDto=new ProduitDto()
      produit.idProduit=val.idProduit
      produit.code=val.code
      produit.dateCreation=val.dateCreation
      produit.designation=val.designation
      produit.isActif=false
      listp.unshift(produit)
    })
    let selectedCars3: any[];
    let visible2 = [
      { value: 1, label: 'Visible', checked: true },
      { value: 0, label: 'Non visible' }
    ];
   let pvs2 = [
      { value: '0', label: 'Tous les Points de vente' },
      { value: '1', label: 'Certaine catégorie' }
    ];
    if(exist){
    //   let listcate:Categorie[]=[]
    // this.listcateogrie.forEach(val=>{
    //   let cata:Categorie=new Categorie()
    //   cata.idCategorie=val.idCategorie
    //   cata.designation=val.designation
    //   listcate.push(cata)
    // })
      const phone = this._FormBuilder.group({ 
        designation1:[''],
        categoriemere1:[],
        description1:[],
        listpvs1:[list],
        categorieexistante:[],
        islistcategie:[true],
        allpv:[pvs2[0].value],
        radio:[visible2],
        pvradio:[pvs2],
        actif1:[true],
        fMobile1:[true],
        chooseproduit:[false],
        products:[listp],
        color:[]
      })
      this.filesTree0[0].children.unshift(
        {
              "label": phone.controls['designation1'].value,
              "data": "",
              "collapsedIcon": "pi pi-list",
          }
      )
      this.itemForms.insert(0,phone);

    }else{
      const phone = this._FormBuilder.group({ 
        designation1:['',[Validators.required]],
        categoriemere1:[],
        description1:[],
        listpvs1:[list],
        categorieexistante:[],
        islistcategie:[false],
        allpv:[pvs2[0].value],
        radio:[visible2],
        pvradio:[pvs2],
        actif1:[true],
        fMobile1:[true],
        chooseproduit:[false],
        products:[listp],
        color:[]
      })
      this.filesTree0[0].children.unshift(
        {
              "label": phone.controls['designation1'].value,
              "data": "",
              "collapsedIcon": "pi pi-list",
          }
      )
      this.itemForms.insert(0,phone);

    }

  
  }
  slected(){
    console.log("***************")
  }
  deleteitem(i) {
    this.itemForms.removeAt(i)
    this.filesTree0[0].children.splice(i, 1);
  }
  choosepv(item:PointVente,event){
    console.log(item)
    console.log(event);
    item.fVisible=event
    console.log(this.itemForms);
        
  }
  get formControls() { return this.categorieForm.controls; }
  files:File;
  imagename:string
  image: any;
  onFileChange(ev) {
    console.log(ev.target.files[0]);

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
  createcategorie(){
    this.iscategorieFormSubmitted=true
    console.log(this.categorieForm.value);
    // console.log(this.categoryArticleProductDtos);
    // console.log(this.listproduit);
    console.log(this.categorieForm.invalid);
    console.log(this.itemForms);
    if(this.categorieForm.invalid || this.itemForms.invalid){
      return
    }else{
      this.loading=true
      console.log(this.color);
      let categoryProduct:categoryProductDto=new categoryProductDto()
      categoryProduct.categorieArticle=new Categorie()
      categoryProduct.categorieArticle.designation=this.categorieForm.value.designation
      categoryProduct.categorieArticle.description=this.categorieForm.value.description
      categoryProduct.categorieArticle.fActif=this.categorieForm.value.actif?1:0
      categoryProduct.categorieArticle.fMobile=this.categorieForm.value.fMobile?1:0
      categoryProduct.categorieArticle.idCategorie=this.categorieForm.value.idcata
      categoryProduct.categorieArticle.idCetgorieMere=this.categorieForm.value.categoriemere
      categoryProduct.categorieArticle.couleur=this.color!=null?this.color:null
      categoryProduct.categorieArticle.dateCreation=new Date()
      categoryProduct.categorieArticle.idPartenaire=localStorage.getItem("partenaireid")
      categoryProduct.categorieArticle.photo=this.files!=null?this.imagename:this.image 
      categoryProduct.categorieArticle.order=this.categorieForm.value.order
      let pointVentevisibles:PointVentevisible[]=[]
      this.listpointvente.forEach(pv=>{
        let pointVentevisible:PointVentevisible=new PointVentevisible()
        pointVentevisible.fvisible=pv.fVisible
        pointVentevisible.idPointvente=pv.idPointVente
        pointVentevisibles.push(pointVentevisible)
      })
      categoryProduct.idPointVentevisible=pointVentevisibles
      if(this.itemForms.value.length==0){
        categoryProduct.productIds=[]
        console.log(this.globalproduit);
        
                if(this.globalproduit){
                  this.listproduit.forEach(product => {
                    if(product.isActif){
                      categoryProduct.productIds.push(product.idProduit)
                    }
                  });
                }
                
      }
      console.log(categoryProduct);
      this._CategorieEndPointService.createCategorieArticle(categoryProduct).subscribe(rescategory=>{
            console.log(rescategory);
            if(rescategory.result==1){
              if(this.files!=null){
                this._FileEndPointService.uplodeimage(this.files,this.uuids).subscribe(vel=>{
                  console.log(vel);
                })
              }
              let i:number=0
              if(this.itemForms.value.length==0){
                this.router.navigateByUrl("pages/Pointvente/gestionCategorieArticle")
                this._GlobalServiceService.showToast('success','succès',"le categorie a été crée avec succès")
                this.loading=true
              }
              
              this.itemForms.value.forEach(element => {
                let categoryProduct2:categoryProductDto=new categoryProductDto()
                if(element.islistcategie){
                  i=i+1
                  element.categorieexistante.forEach(elementCat => {
                    console.log(elementCat);
                    
                    let pointVentevisibles2:PointVentevisible[]=[]
                    categoryProduct2.categorieArticle=elementCat;

                    categoryProduct2.categorieArticle=new Categorie()
                    categoryProduct2.categorieArticle.designation=elementCat.designation
                    categoryProduct2.categorieArticle.description=elementCat.description
                    if(elementCat.idcata!=null)
                    categoryProduct2.categorieArticle.idCategorie=elementCat.idcata
                    categoryProduct2.categorieArticle.fActif=1
                    categoryProduct2.categorieArticle.fMobile=1
                    categoryProduct2.categorieArticle.couleur=elementCat.color
                    categoryProduct2.categorieArticle.idCetgorieMere=rescategory.objectResponse.idCategorie
                    categoryProduct2.categorieArticle.dateCreation=elementCat.dateCreation
                    categoryProduct2.categorieArticle.idPartenaire=localStorage.getItem("partenaireid")
                    categoryProduct2.categorieArticle.photo=elementCat.photo
                    categoryProduct2.categorieArticle.idCategorie=elementCat.idCategorie
                    categoryProduct2.categorieArticle.idCetgorieMere=rescategory.objectResponse.idCategorie
                    
                    element.listpvs1.forEach(pv=>{
                      let pointVentevisible:PointVentevisible=new PointVentevisible()
                      pointVentevisible.fvisible=pv.fVisible
                      pointVentevisible.idPointvente=pv.idPointVente
                      pointVentevisibles2.push(pointVentevisible)
                    })
                    categoryProduct2.idPointVentevisible=pointVentevisibles2
                    categoryProduct2.productIds=[]
                    if(element.chooseproduit){
                      element.products.forEach(product => {
                        if(product.isActif){
                          categoryProduct2.productIds.push(product.idProduit)
                        }
                      });
                    }
                    this._CategorieEndPointService.updateCategorieArticle(categoryProduct2).subscribe(rescategory2=>{
                      console.log(rescategory2);
                      
                      if(this.itemForms.value.length==i){
                        this.router.navigateByUrl("pages/Pointvente/gestionCategorieArticle")
                        this._GlobalServiceService.showToast('success','succès',"le categorie a été crée avec succès")
                        this.loading=true
                      }
                     
                    })
                  });
                  
                }else{
                  categoryProduct2.categorieArticle=new Categorie()
                categoryProduct2.categorieArticle.designation=element.designation1
                categoryProduct2.categorieArticle.description=element.description1
                if(element.idcata!=null)
                categoryProduct2.categorieArticle.idCategorie=element.idcata
                categoryProduct2.categorieArticle.fActif=element.actif1?1:0
                categoryProduct2.categorieArticle.fMobile=element.fMobile1?1:0
                categoryProduct2.categorieArticle.couleur=element.color
                categoryProduct2.categorieArticle.idCetgorieMere=rescategory.objectResponse.idCategorie
                categoryProduct2.categorieArticle.dateCreation=new Date()
                categoryProduct2.categorieArticle.idPartenaire=localStorage.getItem("partenaireid")
                categoryProduct2.categorieArticle.photo=this.files!=null?this.imagename:null 
                let pointVentevisibles2:PointVentevisible[]=[]
                element.listpvs1.forEach(pv=>{
                  let pointVentevisible:PointVentevisible=new PointVentevisible()
                  pointVentevisible.fvisible=pv.fVisible
                  pointVentevisible.idPointvente=pv.idPointVente
                  pointVentevisibles2.push(pointVentevisible)
                })
                categoryProduct2.idPointVentevisible=pointVentevisibles2
                categoryProduct2.productIds=[]
                if(element.chooseproduit){
                  element.products.forEach(product => {
                    if(product.isActif){
                      categoryProduct2.productIds.push(product.idProduit)
                    }
                  });
                }
                console.log(categoryProduct2);
                
                this._CategorieEndPointService.createCategorieArticle(categoryProduct2).subscribe(rescategory2=>{
                  console.log(rescategory2);
                  i=i+1
                  if(this.itemForms.value.length==i){
                    this.router.navigateByUrl("pages/Pointvente/gestionCategorieArticle")
                    this._GlobalServiceService.showToast('success','succès',"le categorie a été crée avec succès")
                    this.loading=true
                  }
                 
                })
                }
                
              });
            }else{
              this.loading=true
              this._GlobalServiceService.showToast('danger',"Erreur",rescategory.errorDescription)
            }
          },erreur=>{
            this.loading=true
            this._GlobalServiceService.showToast('danger',"Erreur",erreur)

          })
  }
    // if(this.categorieForm.invalid){
    //   return
    // }else{
    //   let categoryProduct:categoryProductDto=new categoryProductDto()
    //   categoryProduct.categorieArticle=new Categorie()
    //   categoryProduct.categorieArticle.designation=this.categorieForm.value.designation
    //   categoryProduct.categorieArticle.fActif=this.categorieForm.value.actif?1:0
    //   categoryProduct.categorieArticle.idCetgorieMere=null
    //   categoryProduct.categorieArticle.dateCreation=new Date()
    //   categoryProduct.categorieArticle.idPartenaire=localStorage.getItem("partenaireid")
    //   categoryProduct.categorieArticle.photo=this.files!=null?this.imagename:null
    //   this._CategorieEndPointService.createCategorieArticle(categoryProduct).subscribe(rescategory=>{
    //     console.log(rescategory);
    //     if(rescategory.result==1){
    //       console.log(this.categoryArticleProductDtos);
          
    //       if(this.categoryArticleProductDtos.length>0){
    //         this.categoryArticleProductDtos.forEach(val=>{
    //           let produitid:string[]=[]
    //           if(val.categorieArticle.idCategorie!=null){
    //             val.products.forEach(element => {
    //               if(element.isActif){
    //                 produitid.push(element.idProduit)
    //               }
    //             });
    //             console.log("*********************************");
    //             if(localStorage.getItem("pointventeid")!=null){
    //               this._CategorieEndPointService.affecteProduitToCateogrie(val.categorieArticle.idCategorie,localStorage.getItem("pointventeid"),produitid).subscribe(res=>{
    //                 console.log(res);
                    
    //               })
    //             }else{
    //               this._PointVenteEndPointService.findAllByIdPartenaireBprice(localStorage.getItem("partenaireid")).subscribe(vals=>{
    //                 vals.objectResponse.forEach(el=>{
    //                   this._CategorieEndPointService.affecteProduitToCateogrie(val.categorieArticle.idCategorie,el.idPointVente,produitid).subscribe(res=>{
    //                     console.log(res);
                        
    //                   })
    //                 })
    //               })
    //             }
                
    //           }else{
    //             console.log('-----------------------------------')

    //             let categoryProductchild:categoryProductDto=new categoryProductDto()
    //             categoryProductchild.categorieArticle=new Categorie()
    //             categoryProductchild.categorieArticle.designation=val.categorieArticle.designation
    //             categoryProductchild.categorieArticle.fActif=1
    //             categoryProductchild.categorieArticle.dateCreation=new Date()
    //             categoryProductchild.categorieArticle.idCetgorieMere=rescategory.objectResponse.idCategorie
    //             categoryProductchild.categorieArticle.idPartenaire=localStorage.getItem("partenaireid")
    //             categoryProductchild.categorieArticle.photo=this.files!=null?this.imagename:null
    //             this._CategorieEndPointService.createCategorieArticle(categoryProductchild).subscribe(res=>{
    //               console.log(res);
                  
    //               if(res.result==1){
    //                 val.products.forEach(element => {
    //                   if(element.isActif){
    //                     produitid.push(element.idProduit)
    //                   }
    //                 });                    
    //                 if(localStorage.getItem("pointventeid")!=null){
    //                   this._CategorieEndPointService.affecteProduitToCateogrie(res.objectResponse.idCategorie,localStorage.getItem("pointventeid"),produitid).subscribe(res=>{
    //                     console.log(res);
                        
    //                   })
    //                 }else{
    //                   this._PointVenteEndPointService.findAllByIdPartenaireBprice(localStorage.getItem("partenaireid")).subscribe(vals=>{
    //                     vals.objectResponse.forEach(el=>{
    //                       this._CategorieEndPointService.affecteProduitToCateogrie(res.objectResponse.idCategorie,el.idPointVente,produitid).subscribe(res=>{
    //                         console.log(res);
                            
    //                       })
    //                     })
    //                   })
    //                 }
    //               }
    //             })
    
    //           }
    //         })
    //         this.router.navigateByUrl("pages/Pointvente/gestionCategorieArticle")

    //       }else{
    //         let produitid:string[]=[]
    //         console.log('00000000000000000000000000000000')
    //         console.log('--------------------------------')
    //         console.log(this.listproduit);
    //         console.log(rescategory);
    //         console.log('********************************')
    //         this.listproduit.forEach(element => {
    //           if(element.isActif){
    //             produitid.push(element.idProduit)
    //           }
    //         });
    //         //categoryProduct.productIds=produitid
    //         if(localStorage.getItem("pointventeid")!=null){
    //           this._CategorieEndPointService.affecteProduitToCateogrie(rescategory.objectResponse.idCategorie,localStorage.getItem("pointventeid"),produitid).subscribe(res=>{
    //             console.log(res);
    //             this.router.navigateByUrl("pages/Pointvente/gestionCategorieArticle")

    //           })
    //         }else{
    //           this._PointVenteEndPointService.findAllByIdPartenaireBprice(localStorage.getItem("partenaireid")).subscribe(vals=>{
    //             vals.objectResponse.forEach(el=>{
    //               this._CategorieEndPointService.affecteProduitToCateogrie(rescategory.objectResponse.idCategorie,el.idPointVente,produitid).subscribe(res=>{
    //                 console.log(res);
    //                 this.router.navigateByUrl("pages/Pointvente/gestionCategorieArticle")

    //               })
    //             })
    //           })
    //         }
    //       }
    //     }
    //   })
 
      

    // }

  }
  draggedProduct: Prodcut;

    selectedProdcuts: Prodcut[]=[];

  dragStart(event,product: Prodcut) {
    this.draggedProduct = product;
}

drop(event) {
  console.log(event);
  
    if(this.draggedProduct) {
        let draggedCarIndex = this.findIndex(this.draggedProduct);
        this.selectedProdcuts = [...this.selectedProdcuts, this.draggedProduct];
        this.products = this.products.filter((val,i) => i!=draggedCarIndex);
        this.draggedProduct = null;
    }
}
findIndex(product: Prodcut) {
  let index = -1;
  for(let i = 0; i < this.products.length; i++) {
      if(product.idProduit === this.products[i].idProduit) {
          index = i;
          break;
      }
  }
  return index;
}
dragEnd(event) {
    this.draggedProduct = null;
}

removeproduct(product:Prodcut){
  this.selectedProdcuts=this.selectedProdcuts.filter(val=>val.idProduit!=product.idProduit)
  this.products.push(product)
}

status: NbComponentStatus = 'danger';
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
defaultimage:string="https://static.thenounproject.com/png/220984-200.png"

veriftypefile(valeur){
  if(valeur.toLocaleLowerCase().endsWith(".png")||valeur.toLocaleLowerCase().endsWith(".jpg")||valeur.toLocaleLowerCase().endsWith(".gif")||valeur.toLocaleLowerCase().endsWith(".jpeg")){
return true}else{
  return false
}
}

choosecategorie(){
  let categoryArticleProductDto:CategoryArticleProductDto=new CategoryArticleProductDto()
  if(this.desi!=null){
    let category:Categorie=new Categorie()
    category.dateCreation=new Date()
    category.designation=this.desi
    category.fActif=1
    category.fMobile=1
    categoryArticleProductDto.categorieArticle=category
    let produitDtos:ProduitDto[]=[]
    this.produitDtos.forEach(val=>{
      let produitdto:ProduitDto=new ProduitDto()
      produitdto.designation=val.designation
      produitdto.idProduit=val.idProduit
      produitdto.code=val.code
      produitdto.dateCreation=val.dateCreation
      produitdto.isActif=false
      produitDtos.push(produitdto)
    })
    categoryArticleProductDto.products=produitDtos
    this.categoryArticleProductDtos.push(categoryArticleProductDto)
  }else{
    this.listcateogrie.forEach(val=>{
      let categoryArticleProductDto:CategoryArticleProductDto=new CategoryArticleProductDto()
      let category:Categorie=new Categorie()
    category.dateCreation=val.dateCreation
    category.designation=val.designation
    category.fActif=1
    category.fMobile=1
    category.idCategorie=val.idCategorie
    categoryArticleProductDto.categorieArticle=category
      let produitDtos:ProduitDto[]=[]
      this.produitDtos.forEach(val=>{
        let produitdto:ProduitDto=new ProduitDto()
      produitdto.designation=val.designation
      produitdto.code=val.code
      produitdto.idProduit=val.idProduit
      produitdto.dateCreation=val.dateCreation
      produitdto.isActif=false
      produitDtos.push(produitdto)
      })
      categoryArticleProductDto.products=produitDtos
    this.categoryArticleProductDtos.push(categoryArticleProductDto)
    })
  }
  this.desi=null
  this.listcateogrie=[]
  this.exist=false

  
}

addcategorie(){

}

chooseformlistcategorie(){

}

ngOnDestroy(): void {
  if (this.interval) {
    clearInterval(this.interval);
  }
}

onEventLog(evnt,evnt2){
  this.color=evnt2.color
}

onEventLogfils(evnt,evnt2,index){
  console.log(index)
  let object:any=this.itemForms.controls[index].value
  object.color=evnt2.color
   this.itemForms.controls[index].setValue(object)
   console.log(this.itemForms.controls[index].value)
}
}
