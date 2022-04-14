import { Component, OnInit } from '@angular/core';
import { MvtStockEndPointService } from '../../../service/bp-api-product/mvt-stock-end-point/mvt-stock-end-point.service';
import { Router } from '@angular/router';
import { PackEndPointService } from '../../../service/bp-api-product/pack-end-point/pack-end-point.service';
import { CategorieEndPointService } from '../../../service/bp-api-product/categorie-end-point/categorie-end-point.service';
import { ProductEndPointService } from '../../../service/bp-api-product/product-end-point/product-end-point.service';
import { DateService } from '../../../service/GlobalService/DateSevice/date.service';
import { GlobalServiceService } from '../../../service/GlobalService/global-service.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GroupeClientPartenaireEndPointService } from '../../../service/bp-api-customer/groupe-client-partenaire-end-point/groupe-client-partenaire-end-point.service';
import { GroupeClientPartenaire } from '../../../model/GroupeClientPartenaire';
import { CustomerEndPointService } from '../../../service/bp-api-customer/customer-end-point/customer-end-point.service';

@Component({
  selector: 'ngx-gestion-groupe-client',
  templateUrl: './gestion-groupe-client.component.html',
  styleUrls: ['./gestion-groupe-client.component.scss']
})
export class GestionGroupeClientComponent implements OnInit {

  
  constructor(private _MvtStockEndPointService:MvtStockEndPointService,private router:Router,
    private _PackEndPointService:PackEndPointService,private _CategorieEndPointService:CategorieEndPointService,
    private _ProductEndPointService:ProductEndPointService,private _DateService:DateService,
    private _GlobalServiceService:GlobalServiceService,private _FormBuilder:FormBuilder,
    private _GroupeClientPartenaireEndPointService:GroupeClientPartenaireEndPointService,
    private _CustomerEndPointService:CustomerEndPointService) { }

  loading:boolean=true
  sortOptions: any[];

    sortKey: string;

    sortField: string;

    sortOrder: number;
    prodcuts:any[]
    affichefilter:boolean=false
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
    addgroupe:boolean=false
    editgroupe:boolean=false
    groupeForm:FormGroup
    isSubmitted:boolean=false
    public color: string;
    groupes:GroupeClientPartenaire[]=[]
    displylistclient:boolean=false
    listclients:any[]=[]
    ngOnInit() {
    this.calendar=this.calendar_fr
    this.groupeForm=this._FormBuilder.group({
      designation :['',[Validators.required]],
      isActif: [false]
    })
    this.cols = [
      { field: 'designation', header: 'designation' },
      { field: 'prixPack', header: 'prixPack' },
      { field: 'composition', header: 'composition' },
      { field: 'action', header: 'action' }

  ];
  this.cols2 = [
    { field: 'designation', header: 'designation' },
    { field: 'prixPack', header: 'prixPack' },
    { field: 'composition', header: 'composition' },
    { field: 'designation', header: 'designation' },
    { field: 'prixPack', header: 'prixPack' }

];
  this._GroupeClientPartenaireEndPointService.findAllByIdPartenaireOrderByDateCreationDesc(localStorage.getItem("partenaireid")).subscribe(val=>{
    this.loading=false
    console.log(val);
    
    if(val.result==1){
      this.groupes=val.objectResponse
    }else{
      this.groupes=[]
    }
  })
  
  
  }

  onEventLog(evnt,evnt2){
    this.color=evnt2.color
  }
  getname(id){
    if( this.prodcuts!=null &&  this.prodcuts.length>0)
    return this.prodcuts.filter(el=>el.idProduit==id)[0].designation
  } 
packs:any[]=[]
packs2:any[]=[]


cols: any[];

creategroupe(){
  this.isSubmitted=true
  if(this.groupeForm.invalid){
    return
  }else{
    let group:GroupeClientPartenaire=new GroupeClientPartenaire()

    if(this.currnetcient!=null){
      group.idGroupeClientPartenaire=this.currnetcient.idGroupeClientPartenaire
    }
      group.couleur=this.color
      group.dateCreation=new Date()
      group.idPartenaire=localStorage.getItem("partenaireid")
      group.isActif=this.groupeForm.value.isActif?1:0
      group.designation=this.groupeForm.value.designation
        this._GroupeClientPartenaireEndPointService.CreateGroupeClientPartenaire(group).subscribe(el=>{
          if (el.result == 1 ){
            if(this.currnetcient!=null){
              this.groupes.forEach(ee=>{
                if(ee.idGroupeClientPartenaire==this.currnetcient.idGroupeClientPartenaire){
                  ee.couleur=group.couleur
                  ee.isActif= group.isActif
                  ee.designation=group.designation
                }
              })
              this._GlobalServiceService.showToast("success","Succès",'le Groupe a été modifier avec succée');

            }else{
              this.groupes.unshift(el.objectResponse)
              this._GlobalServiceService.showToast("success","Succès",'le Groupe a été crée avec succée');
            }
                
          
              }else{
                this._GlobalServiceService.showToast('danger',"Echec",el.errorDescription);
              }
        },erreur=>{
        this._GlobalServiceService.showToast('danger',"Echec","Un problème de connection est survenue, Veuillez réessayer ulterieurement");

        })
    this.editgroupe=false;
    this.addgroupe=false;
    this.isSubmitted=false
    this.color=null
  }
}
get formControls() { return this.groupeForm.controls; }
redirect(){
  this.addgroupe=true
  this.currnetcient=null
  this.isSubmitted=false
  this.color=null
  this.groupeForm=this._FormBuilder.group({
    designation :['',[Validators.required]],
    isActif: [false]
  })
}
edits(groupe:GroupeClientPartenaire){
  console.log(groupe);
  this.currnetcient=groupe
  this.groupeForm=this._FormBuilder.group({
    designation :[groupe.designation,[Validators.required]],
    isActif: [groupe.isActif==1]
  })
  this.color=groupe.couleur
  this.editgroupe=true
}
diplaypack:boolean=false
deletes(prdouit:any){
this.currnetcient=prdouit
this.diplaypack=true
  
}

deletepack(){
  // this._PackEndPointService.DeletePack(this.currentpack.idPack).subscribe(val=>{
  //   if (val.result == 1 ){
  //     this._GlobalServiceService.showToast("success","Succès",'le Pack a été supprimer avec succée');

  //   }else{
  //     this._GlobalServiceService.showToast('danger',"Echec",val.errorDescription);
  //   }
  // },erreur=>{
  //   this._GlobalServiceService.showToast('danger',"Echec","Un problème de connection est survenue, Veuillez réessayer ulterieurement");
  // });
}

displyagent:boolean
currnetcient:GroupeClientPartenaire
deactive(agent){
  this.currnetcient=agent
  if(this.currnetcient.isActif!=0){
  this.displyagent=true
  }else{
    this.activagent()
  }
}

activagent(){
  console.log(this.currnetcient);
  this._GroupeClientPartenaireEndPointService.actifGroupeClientPartenaire(this.currnetcient.idGroupeClientPartenaire,1).subscribe(val=>{
        if(val.result==0){
       this._GlobalServiceService.showToast('success','succès',"le groupe a été activé avec succés")
       this.groupes.forEach(ee=>{
         if(ee.idGroupeClientPartenaire==this.currnetcient.idGroupeClientPartenaire){
           ee.isActif=1
         }
       })
     }else{
       this._GlobalServiceService.showToast('danger','Erreur',val.errorDescription)
     }
   },erreur=>{
     this._GlobalServiceService.showToast('danger','Erreur',erreur)
     
   })
}
deleteagent(){
  console.log(this.currnetcient);
  this._GroupeClientPartenaireEndPointService.actifGroupeClientPartenaire(this.currnetcient.idGroupeClientPartenaire,0).subscribe(val=>{
    if(val.result==0){
   this._GlobalServiceService.showToast('success','succès',"le groupe a été deactivé avec succés")
   this.groupes.forEach(ee=>{
     if(ee.idGroupeClientPartenaire==this.currnetcient.idGroupeClientPartenaire){
       ee.isActif=0
     }
   })
 }else{
   this._GlobalServiceService.showToast('danger','Erreur',val.errorDescription)
 }
},erreur=>{
 this._GlobalServiceService.showToast('danger','Erreur',erreur)
 
})
}
loading2:boolean=false
cols2:any[]
affichielist(groupe:GroupeClientPartenaire){
  this.listclients=[]
  this.loading2=true
  
  this._CustomerEndPointService.findAllByIdPartenaireAndIsActifAndIdGroupeClientPartenaire(localStorage.getItem("partenaireid"),groupe.idGroupeClientPartenaire).subscribe(val=>{
    console.log(val);

    if(val.result==1){
      this.listclients=val.objectResponse
    }else{
      this.listclients=[]
    }
    this.displylistclient=true
    this.loading2=false
  })

}
}
