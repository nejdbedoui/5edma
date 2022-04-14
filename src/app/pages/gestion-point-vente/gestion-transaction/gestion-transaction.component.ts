import { CommandeDetailsDto } from './../../../model/dto/CommandeDetailsDto';
import { CommandeDetails } from './../../../model/CommandeDetails';
import { Component, OnInit } from '@angular/core';
import { CommandeEndPointService } from '../../../service/bp-api-transaction/commande-end-point/commande-end-point.service';
import { Commande } from '../../../model/Commande';
import { CommandeDetailsEndPointService } from '../../../service/bp-api-transaction/commande-details-end-point/commande-details-end-point.service';
import { RegelementEndPointService } from '../../../service/bp-api-transaction/regelement-end-point/regelement-end-point.service';
import { ReglementDto } from '../../../model/dto/ReglementDto';
import { PackEndPointService } from '../../../service/bp-api-product/pack-end-point/pack-end-point.service';
import { ProduitProintVenteEndPointService } from '../../../service/bp-api-product/produit-proint-vente-end-point/produit-proint-vente-end-point.service';
import { VProduitProduitpointvente } from '../../../model/VProduitProduitpointvente';

@Component({
  selector: 'ngx-gestion-transaction',
  templateUrl: './gestion-transaction.component.html',
  styleUrls: ['./gestion-transaction.component.scss']
})
export class GestionTransactionComponent implements OnInit {

  constructor(private _CommandeEndPointService:CommandeEndPointService,private _CommandeDetailsEndPointService:CommandeDetailsEndPointService,
    private _RegelementEndPointService:RegelementEndPointService,private _ProduitProintVenteEndPointService:ProduitProintVenteEndPointService) { }

  listtransaction:Commande[]=[]
  listtransactionAnnule:Commande[]=[]
  listtransactiondetails:CommandeDetailsDto[]=[]
  listtransactiondetaulsannule:any[]=[]
  listproduit:VProduitProduitpointvente[]=[]
  listreglements:ReglementDto[]=[]
  pointventeid:string;
  loading:boolean=true
  loadingAllTrasaction:boolean=true
  displaymap:boolean=false
  loading1:boolean=true
  loading2:boolean=true
  displayreg:boolean=false
  loadingListTransactiondetaulsAnnule: boolean = false;
  displaycommande:boolean=false;
  idcommande:string;
  cols:any[]
  cols2:any[]
  cols3:any[]
  colsAnnuledTranstions:any[]
  packs:any[]
  ngOnInit() {
    this._ProduitProintVenteEndPointService.findAllProduitPointVenteByIdPointVente(localStorage.getItem("pointventeid")).subscribe(val=>{
      console.log(val);
      this.listproduit=val.objectResponse
    })
    this.cols = [
      { field: 'Nom du produit', header: 'Nom du produit' },
      { field: 'Prix', header: 'Prix' },
      { field: 'Quantié', header: 'Quantié' }
  ];
  this.cols2 = [
    { field: 'Numéro Ticket', header: 'Numéro Ticket' },
    { field: 'Montant', header: 'Montant' },
    { field: 'DateCreation', header: 'DateCreation' },
    { field: 'fPaye', header: 'fPaye' },
    { field: 'fPaye', header: 'fPaye' },
    { field: 'fPaye', header: 'fPaye' },
    { field: 'Action', header: 'Action' }
];
this.cols3 = [
  { field: 'Montant', header: 'Montant' },
  { field: 'Date', header: 'Date' },
  { field: 'Mode Regelement', header: 'Mode Regelement' }
];

this.colsAnnuledTranstions= [
  { field: 'Numéro Ticket', header: 'Numéro Ticket' },
  { field: 'Nom du produit', header: 'Nom du produit'},
  { field: 'Montant', header: 'Montant' },
  { field: 'Quantié', header: 'Quantié' },
  { field: 'DateCreation', header: 'DateCreation' },
  { field: 'fPaye', header: 'fPaye' }
];
    this.pointventeid=localStorage.getItem("pointventeid");
    this._CommandeEndPointService.findAllByIdPointVenteandType(this.pointventeid,1,0).subscribe(res=>{
      console.log(res);
      if(res.result==1){
        this.listtransaction=res.objectResponse;
        this.loadingAllTrasaction=false
      }else {
        this.loadingAllTrasaction=false
        this.listtransaction=[]
      }
    })
    this._CommandeDetailsEndPointService.findByIdCommandeDetailsAnuuler(this.pointventeid).subscribe(vals=>{
      console.log(vals.objectResponse);
      
      if(vals.result==1){
        this.loadingListTransactiondetaulsAnnule=false
        this.listtransactiondetaulsannule=vals.objectResponse
      }else {
        this.loadingListTransactiondetaulsAnnule=false
        this.listtransactiondetaulsannule=[]
      }
    })
    this.getAnnuledCommande();
  }
  details:boolean=false
  details1:boolean=false
  changetab(event){
    console.log(event);
    if(event.tabTitle=="liste details commandes Annulées"){
      this.details=true;
      this.details1=false;
    }else if(event.tabTitle=="liste Commandes Annulées"){
      this.details1=true;
      this.details=true;
    }else{
      this.details=false;
      this.details1=false;
    }
    
  }
  deleteCommande(){
    this._CommandeEndPointService.AnnulerCommande(this.idcommande).subscribe(val=>{
      this.listtransactionAnnule.push(this.listtransaction.find(el=>el.idCommande==this.idcommande))
      this.listtransaction=this.listtransaction.filter(el=>el.idCommande!=this.idcommande);
    })
    this.listtransactionAnnule.push()
  }
  getAnnuledCommande(){
    this._CommandeEndPointService.findAllByIdPointVenteandType(this.pointventeid,1,1).subscribe(res=>{
      console.log(res);
      if(res.result==1){
        this.loading=false
        this.listtransactionAnnule=res.objectResponse
      }else {
        this.loading=false
        this.listtransactionAnnule=[]
      }
    })
  }
  chosenCommande: any;
  choosecommande(commande:Commande, idCommande:string){
    this.loading1=true
    this.listtransactiondetails=[];
    this.chosenCommande= commande;
    this._CommandeDetailsEndPointService.findAllByIdTicket(idCommande).subscribe(res=>{
      console.log(res);
      
      if(res.result==1){
        this.loading1=false
        this.listtransactiondetails=res.objectResponse
      }else{
        this.loading1=false
        this.listtransactiondetails=[]
      }
    })
  }

  choosecommandeannuler(idcommande:string){
    this.loading1=true
    this.listtransactiondetails=[]
    this._CommandeDetailsEndPointService.findAllByIdTicketannuler(idcommande).subscribe(res=>{
      console.log(res);
      
      if(res.result==1){
        this.loading1=false
        this.listtransactiondetails=res.objectResponse
      }else{
        this.listtransactiondetails=[]
        this.loading1=false
      }
    })
  }

  seeRegelemnt(idcommande:string){
    this.loading2=true
    this._RegelementEndPointService.findAllRegelementByIdTicket(idcommande).subscribe(res=>{
      console.log(res);
      
      if(res.result==1){
        this.loading2=false
        this.listreglements=res.objectResponse
      }else{
        this.loading2=false
      }
    })
  }


getproduitname(idp){  
return this.listproduit.filter(el=>el.idProduit==idp)[0].designation
}


  customSort(event: any) {
    console.log(event);
    if(event.field=="fPaye"){
      if(event.order==1){
        event.data.sort((data1:Commande, data2:Commande) => {
          return data2.fPaye -data1.fPaye
       });
      }else{
        event.data.sort((data1:Commande, data2:Commande) => {
          return data1.fPaye -data2.fPaye
       });
      }
      
    }else{
      if(event.order==1){
        event.data.sort((data1:Commande, data2:Commande) => {
          return new Date(data2.dateCreation).getTime() -new Date(data1.dateCreation).getTime()
       });
      }else{
        event.data.sort((data1:Commande, data2:Commande) => {
          return new Date(data1.dateCreation).getTime() -new Date(data2.dateCreation).getTime()
       });
      }
    }

     
  // this._CommandeEndPointService.findAllByIdPointVente("1",event.order).subscribe(res=>{
  //     console.log(res);
      
  //     if(res.result==1){
  //       this.loading=false
  //       this.listtransaction=res.objectResponse
  //     }else {
  //       this.loading=false
  //       this.listtransaction=[]
  //     }
  //   })
    
}

}
