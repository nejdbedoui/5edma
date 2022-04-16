import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { BonCommandePv } from '../../../model/BonCommandePv';
import { CommandePv } from '../../../model/CommandePv';
import { DetailCommandePv } from '../../../model/DetailCommandePv';
import { Prodcut } from '../../../model/Product';
import { BonCommandePvEndPointService } from '../../../service/bp-api-pos/bon-commande-pv-end-poin/bon-commande-pv-end-point.service';
import { ProductEndPointService } from '../../../service/bp-api-product/product-end-point/product-end-point.service';
import { GlobalServiceService } from '../../../service/GlobalService/global-service.service';
const pdfMake = require('pdfmake/build/pdfmake.js');
const pdfFonts = require('pdfmake/build/vfs_fonts');
pdfMake.vfs = pdfFonts.pdfMake.vfs;
@Component({
  selector: 'ngx-gestion-bon-commandes',
  templateUrl: './gestion-bon-commandes.component.html',
  styleUrls: ['./gestion-bon-commandes.component.scss']
})
export class GestionBonCommandesComponent implements OnInit {

  bon$:BonCommandePv[]=[];
  datedeb:Date;
  datefin:Date;
  affichefilter:boolean=false;
  nomcatbon:String='default';
  typebon:String='default';
  statusbon:String='default';
  pointvente: String='default';
  cat:Array<String>=[];
  listepointsVente:Array<String>=[];
  AllBonCommande:boolean = true;
  
  loading:boolean=true;
  ListeBonCommande:BonCommandePv[]=[];
  cols: { field: string; header: string; }[];

  sortOptions: any[];

    sortKey: string;

    sortField: string;
    idpointVente=localStorage.getItem("pointventeid")
    sortOrder: number;
    diplay:boolean=false;

  constructor(private datePipe: DatePipe,private _bonCommandeService: BonCommandePvEndPointService,private route: Router,private _GlobalService:GlobalServiceService,private _produitService:ProductEndPointService) { }

  ngOnInit() {
    this._bonCommandeService.findAllBonCommandePv().subscribe(val=>{
      this.loading=false
      if(val.result==1){
       

        val.objectResponse.forEach(value =>
          {if(value.statut != 0){
            this.ListeBonCommande.push(value)
          }
        }
          )
         
        this.bon$=this.ListeBonCommande
        this.clean();
        
      }
    });   
  }

  getStatus(stat:number){
    if(stat==0)
    return "Crée"
    else if(stat==1)
    return "En Cours"
    else if(stat==2)
    return "Traité"
  
  }

  
  filter(a,b,c,e,d:Date,f:Date){
    this.bon$ =this.ListeBonCommande;
    if(a!="default")
    this.bon$ = this.bon$.filter(
      item => item.nomCategorie === a
    );

    if(b!="default")
    this.bon$ = this.bon$.filter(
      item => this.getStatus(item.statut) === this.getStatus(b)
    );

    if(c!="default")
    this.bon$ = this.bon$.filter(
      item => item.type === c
    );
    if(e!="default")
    this.bon$ = this.bon$.filter(
      item => item.nomPointVente === e
    );
    if(d != null)
    this.bon$=this.bon$.filter(
      item=> this.format(new Date(item.date)) == this.format(d)
    )
    if(f != null && d!=null){
      this.filter(a,b,c,e,null,f);
    this.bon$=this.bon$.filter(
      item=> this.format(new Date(item.date)) >= this.format(d) && this.format(new Date(item.date)) <= this.format(f)
    )
    }
    this.bon$.forEach(value =>
      {this.listepointsVente.push(value.nomPointVente);
      this.cat.push(value.nomCategorie)}
      )
this.cat = this.cat.filter(function(elem, index, self) {
  return index === self.indexOf(elem);
})
}
format(a){
  return this.datePipe.transform(a, 'dd/MM/yyyy')
}

select1(value){
  this.nomcatbon=value;
  this.filter(this.nomcatbon,this.statusbon,this.typebon,this.pointvente,this.datedeb,this.datefin)
}

select2(value){
  this.statusbon=value;
  this.filter(this.nomcatbon,this.statusbon,this.typebon,this.pointvente,this.datedeb,this.datefin)
}

select3(value){
  this.typebon=value;
  this.filter(this.nomcatbon,this.statusbon,this.typebon,this.pointvente,this.datedeb,this.datefin)
}
select4(value){
  this.pointvente=value;
  this.filter(this.nomcatbon,this.statusbon,this.typebon,this.pointvente,this.datedeb,this.datefin)
}

filterDateDeb(value){
  this.datedeb = value;
  this.filter(this.nomcatbon,this.statusbon,this.typebon,this.pointvente,this.datedeb,this.datefin)
  
}
filterDateFin(value){
  this.datefin = value,
  this.filter(this.nomcatbon,this.statusbon,this.typebon,this.pointvente,this.datedeb,this.datefin)
  
}


clean(){
  this.datedeb=new Date();
  this.datefin=null;
  this.nomcatbon="default";
  this.statusbon="default";
  this.typebon="default";
  this.pointvente="default";
  this.AllBonCommande = false;
  this.filter(this.nomcatbon,this.statusbon,this.typebon,this.pointvente,this.datedeb,this.datefin)
}

ShowAllBons(){
  this.AllBonCommande=!this.AllBonCommande;
  if(this.AllBonCommande){
    this.filter(this.nomcatbon,this.statusbon,this.typebon,this.pointvente,null,null);
  }
  else{
    this.filter(this.nomcatbon,this.statusbon,this.typebon,this.pointvente,new Date(),null);
  }
}






loading2:boolean=false
  getListeCommande(id:string,i:number){
    this.diplay=true
    this.loading2=true
    this._bonCommandeService.findByIdBonCommandeAllCommandes(id).subscribe(val=>{
      if(val.objectResponse!=null){
       if(this.ListeBonCommande[i].ListeCommandes==null)
        this.ListeBonCommande[i].ListeCommandes=val.objectResponse;
        this.bon$[i].ListeCommandes = this.ListeBonCommande[i].ListeCommandes;
      }
      this.loading2=false   
    })
  }
  loading3:boolean=false
  getListeDetailCommande(idc:String,idbc,j:number){
   
    this.loading3=true
    this._bonCommandeService.findByIdCommandeAllDetailCommande(idc).subscribe(val=>{
      if(val.objectResponse!=null){
        var i = this.ListeBonCommande.findIndex(obj=>obj.idBonCommande==idbc);
       if(this.ListeBonCommande[i].ListeCommandes!=null){
        if(this.ListeBonCommande[i].ListeCommandes[j].ListeDetailCommande==null){
        this.ListeBonCommande[i].ListeCommandes[j].ListeDetailCommande=val.objectResponse;
        }
      }
    }
    this.loading3=false;
    })

  }
  addBonCommande(){
    this.route.navigateByUrl("/pages/Pointvente/gestionBonCommandePv/NouvelleBonCommandePv");
  }
  deleteBonCommande(id:String){
    this._bonCommandeService.deleteBonCommande(id).subscribe(val => {
      if (val.result == 1) {
        this.ListeBonCommande=this.ListeBonCommande.filter(val => val.idBonCommande != id);
        this._GlobalService.showToast("success", "success", "la Bon Commande ete supprimé avec succès")
      } else {
        this._GlobalService.showToast("danger", "Erreur", val.errorDescription)

      }
    }, erreur => {
      this._GlobalService.showToast("danger", "Erreur", "erreur")

    })
  }
  deleteCommande(id:String,rb:number,j:number){
    this._bonCommandeService.deleteCommande(id).subscribe(val => {
      if (val.result == 1) {
        this.ListeBonCommande[rb].ListeCommandes.splice(j,1);
        this._GlobalService.showToast("success", "success", "Commande supprimé avec succès")
      } else {
        this._GlobalService.showToast("danger", "Erreur", val.errorDescription)

      }
    }, erreur => {
      this._GlobalService.showToast("danger", "Erreur", "erreur")

    })
  }


  getListeCommandeData(id:string,index:number){

      return this._bonCommandeService.findByIdBonCommandeAllCommandes(id);
  }
  getListeDetailCommandeData(idc:string){

    return this._bonCommandeService.findByIdCommandeAllDetailCommande(idc);
}
  async Traiter(bon:BonCommandePv){

    let index = this.ListeBonCommande.findIndex(val=>val.idBonCommande==bon.idBonCommande);
    let errormessage:string = "";
    var responseComm = await this.getListeCommandeData(bon.idBonCommande,index).toPromise();

   let correct:boolean = true;
//
if(responseComm.objectResponse.length>0){
  
  responseComm.objectResponse.filter(async value=>{
    if(value.dateReelLivraision==null){
      if(errormessage.length>0)
      errormessage+=", La date du livraison du commande numero : "+value.numCommande+" est vide";
      else
      errormessage+="La date du livraison du commande numero : "+value.numCommande+" est vide";

      var responseDetailCom = await this.getListeDetailCommandeData(value.idCommandePv).toPromise();
      console.log(responseDetailCom)
      if(responseDetailCom.objectResponse.length>0){
      responseDetailCom.objectResponse.filter(val=>{
        if(val.quantiteLivree==null){
          errormessage+=" la quantité livrée du même commande est vide du produit : ."+val.nomProduit;
        }
      });
    }
    }
    else{
      responseComm.objectResponse.filter(val=>{
        if(val.quantiteLivree==null){
          errormessage+=" la quantité livrée du commande numero : "+value.numCommande+" est vide du produit : ."+val.nomProduit;
        }
      });
    }
    if(errormessage.length>0){
      correct = false;
      this._GlobalService.showToast("danger", "Erreur", errormessage);
      console.log(errormessage)
      errormessage="";
      
    }
  });
}
if(correct==true){
this._bonCommandeService.updateBonCommande(bon).subscribe(respone=>{
  if (respone.result == 1){
    //this.ListeBonCommande[index].statut= 2;
    this._GlobalService.showToast("success", "success", "la Bon Commande ete traité avec succès")
  } else {
    this._GlobalService.showToast("danger", "Erreur", respone.errorDescription)

  }
}, erreur => {
  this._GlobalService.showToast("danger", "Erreur", "erreur")

})}

//

    // this.ListeBonCommande[index].ListeCommandes.filter(value=>{
    //   if(value.dateReelLivraision==null){
    //     if(errormessage.length>0)
    //     errormessage+=", La date du livraison du commande numero : "+value.numCommande+" est vide";
    //     else
    //     errormessage+="La date du livraison du commande numero : "+value.numCommande+" est vide";
    //     value.ListeDetailCommande.filter(val=>{
    //       if(val.quantiteLivree==null){
    //         errormessage+=" la quantité livrée du même commande est vide du produit : ."+val.nomProduit+" est vide";
    //       }
    //     });
    //   }
    //   else{
    //     value.ListeDetailCommande.filter(val=>{
    //       if(val.quantiteLivree==null){
    //         errormessage+=" la quantité livrée du commande numero : "+value.numCommande+" est vide du produit : ."+val.nomProduit+" est vide";
    //       }
    //     });
    //   }
    //   if(errormessage.length>0){
    //     this._GlobalService.showToast("danger", "Erreur", errormessage);
    //     console.log(errormessage)
    //     errormessage="";
        
    //   }
    // });


    //bon.statut=2;
    
  }
  //EDIT DETAIL COMMANDE
clonedProducts: { [s: string]: DetailCommandePv; } = {}
  onRowEditInit(detail: DetailCommandePv,rb:number,rc:number,ri:number,idcat:String) {
    let index = parseInt(rb.toString()+rc.toString()+ri.toString());
    this.clonedProducts[index] = {...detail};
    
}

onRowEditSave(detail: DetailCommandePv) {
  
    if (detail.quantiteDemande > 0) {
        this._bonCommandeService.updateDetailCommande(detail).subscribe(response=>{
          if(response.result==1){
            
            this._GlobalService.showToast("success", "success", "Detail commande mise a jour")
          }
          else{
            this._GlobalService.showToast("danger", "Erreur", response.errorDescription)
          }
        }, erreur => {
          this._GlobalService.showToast("danger", "Erreur", "erreur")
    
        });
  }
    else {
      this._GlobalService.showToast("danger", "Erreur", "Quanité doit etre superieur a 0");
    }
}

onRowEditCancel(detail: DetailCommandePv, ind: number,rb:number,rc:number) {

    let index = parseInt(rb.toString()+rc.toString()+ind.toString());
    this.ListeBonCommande[rb].ListeCommandes[rc].ListeDetailCommande[ind] = this.clonedProducts[index];
    delete this.clonedProducts[index];
}

//EDIT COMMANDE
Now:Date = new Date();
@ViewChild('tableCommandes', { static: false }) private tableCommandes: Table;
clonedCommandes: { [s: string]: CommandePv; } = {}
  onRowEditInitCommande(commande: CommandePv,rb:number,rc:number) {
    console.log(rb)
    console.log(rc)
    let index = parseInt(rb.toString()+rc.toString());
    this.clonedCommandes[index] = {...commande};
    commande.dateReelLivraision = new Date(this.ListeBonCommande[rb].date);
    commande.dateReelLivraision.setHours(new Date().getHours());
    commande.dateReelLivraision.setMinutes(new Date().getMinutes());
    commande.dateReelLivraision.setMilliseconds(new Date().getMilliseconds());

    
}
dateLivraison:Date;
onRowEditSaveCommande(commande: CommandePv,rb:number) {
  if(commande.dateReelLivraision){
    if (commande.dateReelLivraision.getTime()>new Date(this.ListeBonCommande[rb].date).getTime()+(3600*1000)) {
       this._bonCommandeService.updateCommande(commande).subscribe(response=>{
       if(response.result==1){
            
           this._GlobalService.showToast("success", "success", "Commande mise a jour");
           }
        else{
            this._GlobalService.showToast("danger", "Erreur", response.errorDescription);
            this.tableCommandes.initRowEdit(commande);
       }
         }, erreur => {
          this._GlobalService.showToast("danger", "Erreur", "erreur");
          this.tableCommandes.initRowEdit(commande.dateReelLivraision.getTime()>new Date().getTime()+(3600*1000));
    
         });
  }
    else {
      console.log(commande.dateReelLivraision);
      this._GlobalService.showToast('danger',"Erreur","Heure doit etre superieur a l'heure actuelle");
      this.tableCommandes.initRowEdit(commande);
    }
  }
  else{
    this._GlobalService.showToast("danger", "Erreur", "Date non valide ");
  }
}

onRowEditCancelCommande(commande: CommandePv, rb:number,rc:number) {

    let index = parseInt(rb.toString()+rc.toString());
    this.ListeBonCommande[rb].ListeCommandes[rc] = this.clonedCommandes[index];
    delete this.clonedCommandes[index];
}
//
onSubmit(bon:BonCommandePv) {

  let dates = bon.date
  

  var docDefinition = { pageSize: 'A4',
  header: {text: 'Facture ', fontSize:30 ,alignment: 'center',bold:true},
  content: [
    
    {	table: {
      body: [
        [
          {
            border: [false, true, false, false],
            fillColor: '#eeeeee',
            text: 'border:\n[false, true, false, true]'
          },
          {
            border: [false, false, false, false],
            fillColor: '#dddddd',
            text: 'border:\n[false, false, false, false]'
          },
          {
            border: [true, true, true, true],
            fillColor: '#eeeeee',
            text: 'border:\n[true, true, true, true]'
          }
        ],
        [
          {
            rowSpan: 3,
            border: [true, true, true, true],
            fillColor: '#eeeeff',
            text: 'rowSpan: 3\n\nborder:\n[true, true, true, true]'
          },
          {
            border: undefined,
            fillColor: '#eeeeee',
            text: 'border:\nundefined'
          },
          {
            border: [true, false, false, false],
            fillColor: '#dddddd',
            text: 'border:\n[true, false, false, false]'
          }
        ],
        [
          '',
          {
            colSpan: 2,
            border: [true, true, true, true],
            fillColor: '#eeffee',
            text: 'colSpan: 2\n\nborder:\n[true, true, true, true]'
          },
          ''
        ],
        [
          '',
          {
            border: undefined,
            fillColor: '#eeeeee',
            text: 'border:\nundefined'
          },
          {
            border: [false, false, true, true],
            fillColor: '#dddddd',
            text: 'border:\n[false, false, true, true]'
          }
        ]
      ]
    }},
    
    {text: "signature client", listType: 'none',bold: true,italics: true,margin: [0, 40, 0, 0]},
    {text: "signature entreprise", listType: 'none',bold: true,italics: true,margin: [0, -12, 0, 0], alignment:'right'},
  

]


};

pdfMake.createPdf(docDefinition).open();

}



}
