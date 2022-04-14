import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ProductEndPointService } from '../../../../service/bp-api-product/product-end-point/product-end-point.service';
import { Router } from '@angular/router';
import { PointVenteEndPointService } from '../../../../service/bp-api-pos/point-vente-end-point/point-vente-end-point.service';
import { GlobalServiceService } from '../../../../service/GlobalService/global-service.service';
import { CategorieEndPointService } from '../../../../service/bp-api-product/categorie-end-point/categorie-end-point.service';
import { PackEndPointService } from '../../../../service/bp-api-product/pack-end-point/pack-end-point.service';
import { PointVente } from '../../../../model/PointVente';
import { Pack } from '../../../../model/Pack';
import { Categorie } from '../../../../model/Categorie';
import { Prodcut } from '../../../../model/Product';
import { OneProduitForPacks } from '../../../../model/dto/OneProduitForPacks';
import { ProduitForPacks } from '../../../../model/dto/ProduitForPacks';
import { Quantite } from '../../../../model/Quantite';
import * as uuid from 'uuid';
import { ProduitDto } from '../../../../model/dto/ProduitDto';
import { ReglesFideliteProduit } from '../../../../model/ReglesFideliteProduit';
import { RegleUtilisationFidelite } from '../../../../model/RegleUtilisationFidelite';
import { JoursRegle } from '../../../../model/JoursRegle';
import { DateService } from '../../../../service/GlobalService/DateSevice/date.service';
import { ReglesFideliteProduitEndPointService } from '../../../../service/bp-api-loyality/regles-fidelite-produit-end-point/regles-fidelite-produit-end-point.service';

@Component({
  selector: 'ngx-create-action-commerciale',
  templateUrl: './create-action-commerciale.component.html',
  styleUrls: ['./create-action-commerciale.component.scss']
})
export class CreateActionCommercialeComponent implements OnInit {

  constructor(private _FormBuilder:FormBuilder,private _ProductEndPointService:ProductEndPointService,
    private router:Router,private _PointVenteEndPointService:PointVenteEndPointService,
    private _GlobalServiceService:GlobalServiceService,private _CategorieEndPointService:CategorieEndPointService,
    private _PackEndPointService:PackEndPointService,private _DateService:DateService,
    private _ReglesFideliteProduitEndPointService:ReglesFideliteProduitEndPointService) { }
  RegleForm:FormGroup
  loading:boolean=false
  diplay:boolean=false
  isSubmitted:boolean=false
  listpointvente:PointVente[]=[]
  cols2:any[]
  dateVisible:boolean=false
  tableVisible:boolean=false
  coutTypes=[{label:'%',value:1},{label:'montant',value:0}];
  remisetype=[{label:'remise caisse',value:'remise'},{label:'remboursement carte',value:'remboursement carte'}];
  // pack:Pack=new Pack()
  reglesFideliteProduit:ReglesFideliteProduit=new ReglesFideliteProduit()
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
  listproduit:ProduitDto[]=[]
  items: FormArray;
  listday:any[]
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
    regles:any[]=[]
  ngOnInit() {
    this.calendar=this.calendar_fr
    this.listday = [
      { day: 'Lundi', code: 'M',Activer:false,startday:null,endday:null },
      { day: 'Mardi', code: 'T',Activer:false,startday:null,endday:null },
      { day: 'Mercredi', code: 'W',Activer:false,startday:null,endday:null },
      { day: 'jeudi', code: 'TH',Activer:false,startday:null,endday:null },
      { day: 'Vendredi', code: 'F',Activer:false,startday:null,endday:null },
      { day: 'Samedi', code: 'SA',Activer:false,startday:null,endday:null },
      { day: 'Dimanche', code: 'SU',Activer:false,startday:null,endday:null },

      
  ];
    this.cols2 = [
      { field: 'qte', header: 'qte' },
      { field: 'Nom', header: 'Nom' },
      { field: 'Action', header: 'Action' },
  ];
    this.RegleForm=this._FormBuilder.group({
      indicremise:[],
      autorisegerant:[false],
      fRacourci:[false],
      datedebut:[],
      datefin:[],
      remise:[this.remisetype[0],[Validators.required]],
      inputvalue:[,[Validators.required,Validators.min(0.001)]],
      value:[this.coutTypes[0],[Validators.required]],
      items: this._FormBuilder.array([])
    })

    this._ReglesFideliteProduitEndPointService.findAllReglesFideliteProduitByIdPartenaire(localStorage.getItem("partenaireid")).subscribe(pv=>{
      console.log(pv);
      this.loading=false
      if(pv.result==1){
        this.regles=pv.objectResponse
      }else{
        this.regles=[]
      }
      console.log(this.regles);
      
    }) 
    this._ProductEndPointService.findAllByPartenaire(localStorage.getItem("partenaireid")).subscribe(val=>{
      this.prodcuts=val.objectResponse      
    })
    this._PointVenteEndPointService.findAllByIdPartenaireBprice(localStorage.getItem("partenaireid")).subscribe(val=>{
      this.listpointvente=val.objectResponse
      this.listpointvente.forEach(el=>{
        el.fVisible=1
      })
    })
    this.addItem()
  }
  get formControls() { return this.RegleForm.controls; }
  
  get itemForms() {
    return this.RegleForm.get('items') as FormArray;
  }
  option:any="0";
  
  addItem(oneProduitForPacks?:OneProduitForPacks) {
    // this.items = this.orderForm.get('items') as FormArray;
    // this.items.push(this.createItem());
    if(oneProduitForPacks==null){
      const phone = this._FormBuilder.group({ 
        qte:['',[Validators.required]],
        prodcuts:[,[Validators.required]]
      })
      this.itemForms.push(phone);
    }else{
      const phone = this._FormBuilder.group({ 
        qte:[oneProduitForPacks.qte,[Validators.required]],
        prodcuts:[oneProduitForPacks.prodcuts]
      })
      this.itemForms.push(phone);
    }
      
      
  }
  slected(){
    console.log("***************")
  }
  deleteitem(i) {
    this.itemForms.removeAt(i)
  }
  verifdatedebut:boolean=false
  verifdatefin:boolean=false

  verifproduit(){

    this.isSubmitted=true

    if(this.RegleForm.invalid ){
      return
    }else{
      if(this.RegleForm.value.items.length==0 || this.RegleForm.value.items==null){
        this._GlobalServiceService.showToast("danger","Echec",'veuillez ajouter au moin un produit');
        return
      }else{
      let allproduitexist:boolean=false
      this.regles.forEach(ell=>{
        if(!allproduitexist){
          if(ell.produitsCombines!=null && ell.produitsCombines.length>0){
            if(ell.produitsCombines.length==this.RegleForm.value.items.length){
              let allproduitexistnbr:number=0
              this.RegleForm.value.items.forEach(val=>{
              if(ell.produitsCombines.filter(element =>{
                if(element.idProduit==val.prodcuts.idProduit && element.quantite==val.qte){
                  return true;
                }else{
                  return false;
                }
              } ).length>0){
                allproduitexistnbr++
              }
            })
            console.log(allproduitexistnbr);
            
            if(allproduitexistnbr==ell.produitsCombines.length){
              allproduitexist=true
              return;
            }
            }
          }else{
            console.log(this.RegleForm.value.items);
            
            if(1==this.RegleForm.value.items.length){
              let allproduitexistnbr:number=0
              this.RegleForm.value.items.forEach(val=>{
              console.log(ell.idProduit);
              console.log(val.prodcuts.idProduit);
              console.log(ell.quantite);
              console.log(val.qte);
                if(ell.idProduit==val.prodcuts.idProduit && ell.quantite==val.qte){
                  
                allproduitexistnbr++
              }
            })
            console.log(allproduitexistnbr);
            
            if(allproduitexistnbr==1){
              allproduitexist=true
              return;
            }
            }
          }
          
        }
    })
    console.log(allproduitexist);
    
    if(allproduitexist){
      this._GlobalServiceService.showToast("danger","Echec",'les produits sont les meme dans una autre action commerciale');

    }else{
      let nbrprix:number=0;
      
      this.createpack()
      console.log('**************');
      
    }

    }
  }
  }
  createpack(){
    this.isSubmitted=true
    // if(this.produitpacks==null ||this.produitpacks.length==0){
    //   this._GlobalServiceService.showToast("danger","Echec",'veuillez ajouter au moin un produit');
    // }
    console.log(this.RegleForm.value);
    //   console.log(this.produitpacks);
    //   console.log(this.listday)
    //   console.log(this.listpointvente);
    if(this.RegleForm.invalid ){
      return
    }else{
      if(this.RegleForm.value.items.length==0 || this.RegleForm.value.items==null){
        this._GlobalServiceService.showToast("danger","Echec",'veuillez ajouter au moin un produit');
        return
      }else{
        if(this.tableVisible){
          this.checklist()
        }else{
          this.reglesFideliteProduit.joursUtilisation=[]
        }
        if(this.dateVisible){
          if(this.RegleForm.value.datedebut==null || this.RegleForm.value.datefin==null){
            this._GlobalServiceService.showToast("danger","Echec",'veuillez Vérifier vos date ');
            if(this.RegleForm.value.datedebut==null){
              this.verifdatedebut=true
              
            }else{
              this.verifdatedebut=false
            }
            if(this.RegleForm.value.datefin==null){
              this.verifdatefin=true
              
            }else{
              this.verifdatefin=false
            }
            return
          }else{
            if(new Date(this.RegleForm.value.datedebut).getTime()<new Date(this.RegleForm.value.datefin).getTime()){
              this.verifdatedebut=false
              this.verifdatefin=false
              this.reglesFideliteProduit.dateDebut=this.RegleForm.value.datedebut
              this.reglesFideliteProduit.dateFin=this.RegleForm.value.datefin
            }else{
              this._GlobalServiceService.showToast("danger","Echec",'veuillez Vérifier vos date ');
              this.verifdatefin=true
              return
            }
          }
          
        }else{
          this.reglesFideliteProduit.dateDebut=null
          this.reglesFideliteProduit.dateFin=null
        }
        this.reglesFideliteProduit.produitsCombines=[]
        if(this.RegleForm.value.items.length>1){
          this.reglesFideliteProduit.quantite=null
          this.reglesFideliteProduit.idProduit=null
          this.RegleForm.value.items.forEach(element => {
            let quantiteproduit:Quantite=new Quantite()
            quantiteproduit.quantite=element.qte
            quantiteproduit.idProduit=element.prodcuts.idProduit
            this.reglesFideliteProduit.produitsCombines.push(quantiteproduit)
          });
        }else{
          this.RegleForm.value.items.forEach(element => {
            this.reglesFideliteProduit.produitsCombines=[]
            this.reglesFideliteProduit.quantite=element.qte
            this.reglesFideliteProduit.idProduit=element.prodcuts.idProduit
          });
        }
        
        this.reglesFideliteProduit.valeur=this.RegleForm.value.inputvalue
        this.reglesFideliteProduit.typeFid=this.RegleForm.value.remise.value
        this.reglesFideliteProduit.fPourcentage=this.RegleForm.value.value.value

        this.reglesFideliteProduit.idPartenaireBprice=localStorage.getItem("partenaireid")
        this.reglesFideliteProduit.isActif=1
        this.reglesFideliteProduit.pointsVentes=[]
        this.listpointvente.forEach(pv=>{
         if(pv.fVisible==1){
          this.reglesFideliteProduit.pointsVentes.push(pv)
         }
        })
      }
      console.log(this.reglesFideliteProduit);
      this.loading=true
      this._ReglesFideliteProduitEndPointService.CreateReglesFideliteProduit(this.reglesFideliteProduit).subscribe(val=>{
        this.loading=true
        if (val.result == 1 ){
          this._GlobalServiceService.showToast("success","Succès",'le reglement est créé avec succès');
          this.isSubmitted = false;
          this.loading=false
          this.router.navigateByUrl("/pages/Pointvente/actionCommerciale")
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
        produitpacks.prodcuts=this.prodcuts.filter(val=>val.idProduit==el.produit.idProduit)[0]
        produitpacks.id=uuid.v4()
        this.addItem(produitpacks)
        
        //this.produitpacks.push(produitpacks)
        
      }

    })
    this.diplayproduit=false
    
  }
  checklist(){
    let list:any[]=this.listday.filter(val=>val.Activer)
      let erruer:boolean=false
      list.forEach(element => {
        if((element.endday!=null && element.endday!='') && (element.startday!=null && element.startday!='')){
          if(new Date(element.endday).getTime()< new Date(element.startday).getTime()){
            erruer=true
          }
        }
      });
      if(erruer){
        this.loading=false
        this._GlobalServiceService.showToast('danger','Erreur',"Veuillez verifier vos horaires ")
        return false;
      }else{
        this.reglesFideliteProduit.joursUtilisation=[]
        
        list.forEach(val=>{
          let joursRegle:JoursRegle=new JoursRegle()
          joursRegle.code=val.code
          if(this.verifdate(val.startday)=='00:00' && this.verifdate(val.endday)=='00:00'){
            joursRegle.debut=this.verifdate(val.startday)
            joursRegle.fin='23:59'
            joursRegle.fAllDay=1
          }else{
            
            joursRegle.debut=this.verifdate(val.startday)
            joursRegle.fin=this.verifdate(val.endday)=='00:00'?'23:59':this.verifdate(val.endday)
            joursRegle.fAllDay=0
          }
          joursRegle.designation=val.day
          this.reglesFideliteProduit.joursUtilisation.push(joursRegle)
        })
        return true;
      }
  }
  verifdate(time){    
    if(time==null){
      return '00:00';
    }else{
      let h:string=time.getHours()
      let m:string=time.getMinutes()
      if(time.getHours()<10){
        h='0'+time.getHours()
      }
      if(time.getMinutes() <10){
        m='0'+time.getMinutes()
      }
      return h+":"+m
    }
  }

}
