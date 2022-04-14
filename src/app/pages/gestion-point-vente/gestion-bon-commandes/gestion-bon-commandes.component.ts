import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { BonCommandePv } from '../../../model/BonCommandePv';
import { DetailCommandePv } from '../../../model/DetailCommandePv';
import { Prodcut } from '../../../model/Product';
import { BonCommandePvEndPointService } from '../../../service/bp-api-pos/bon-commande-pv-end-poin/bon-commande-pv-end-point.service';
import { ProductEndPointService } from '../../../service/bp-api-product/product-end-point/product-end-point.service';
import { GlobalServiceService } from '../../../service/GlobalService/global-service.service';

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
        this.ListeBonCommande.forEach(value =>
          {this.listepointsVente.push(value.nomPointVente);
          this.cat.push(value.nomCategorie)}
          )
    this.cat = this.cat.filter(function(elem, index, self) {
      return index === self.indexOf(elem);
  })
      }
    });   
  }

  getStatus(stat:number){
    if(stat==0)
    return "Crée"
    else if(stat==1)
    return "En Cours"
    else if(stat==2)
    return "Traiter"
  
  }

  
  filter(a,b,c,e,d:Date,f:Date){
    this.bon$ =this.ListeBonCommande;
    if(a!="default")
    this.bon$ = this.bon$.filter(
      item => item.nomCategorie === a
    );

    if(b!="default")
    this.bon$ = this.bon$.filter(
      item => item.statut === b
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
  Traiter(bon:BonCommandePv){
    bon.statut=2;
    this._bonCommandeService.updateBonCommande(bon).subscribe(respone=>{
      if (respone.result == 1){
        let index = this.ListeBonCommande.findIndex(val=>val.idBonCommande==bon.idBonCommande);
        this.ListeBonCommande[index].statut= 2;
        this._GlobalService.showToast("success", "success", "la Bon Commande ete traiter avec succès")
      } else {
        this._GlobalService.showToast("danger", "Erreur", respone.errorDescription)

      }
    }, erreur => {
      this._GlobalService.showToast("danger", "Erreur", "erreur")

    })
  }
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







}
