import { DatePipe } from '@angular/common';
import { Component, Directive, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { timeout } from 'rxjs-compat/operator/timeout';
import { BonCommandePv } from '../../../model/BonCommandePv';
import { DetailCommandePv } from '../../../model/DetailCommandePv';
import { Prodcut } from '../../../model/Product';
import { BonCommandePvEndPointService } from '../../../service/bp-api-pos/bon-commande-pv-end-poin/bon-commande-pv-end-point.service';
import { ProductEndPointService } from '../../../service/bp-api-product/product-end-point/product-end-point.service';
import { GlobalServiceService } from '../../../service/GlobalService/global-service.service';

@Component({
  selector: 'ngx-gestion-bon-commandes-pv',
  templateUrl: './gestion-bon-commandes-pv.component.html',
  styleUrls: ['./gestion-bon-commandes-pv.component.scss']
})
export class GestionBonCommandesPvComponent implements OnInit {
  bon$: BonCommandePv[] = [];
  datedeb: Date;
  datefin: Date;
  affichefilter: boolean = false;
  options: string[];
  nomcatbon: String = 'default';
  typebon: String = 'default';
  statusbon: String = 'default';
  cat: Array<String> = [];
  AllBonCommande: boolean = true;

  loading: boolean = true;
  ListeBonCommande: BonCommandePv[] = [];
  PointVenteid = localStorage.getItem('pointventeid');
  cols: { field: string; header: string; }[];

  sortOptions: any[];

  sortKey: string;

  sortField: string;
  idpointVente = localStorage.getItem("pointventeid")
  sortOrder: number;
  diplay: boolean = false;

  constructor(private datePipe: DatePipe, private _bonCommandeService: BonCommandePvEndPointService, private route: Router, private _GlobalService: GlobalServiceService, private _produitService: ProductEndPointService) { }

  ngOnInit() {
    this._bonCommandeService.findAllBonCommandePvByIdPointVente(this.PointVenteid).subscribe(val => {
      this.loading = false
      if (val.result == 1) {
        this.ListeBonCommande = val.objectResponse
        this.bon$ = this.ListeBonCommande
        this.clean();

        
      }
    });
  }


  filter(a, b, c, d: Date, f: Date) {
    this.bon$ = this.ListeBonCommande;
    if (a != "default")
      this.bon$ = this.bon$.filter(
        item => item.nomCategorie === a
      );

    if (b != "default")
      this.bon$ = this.bon$.filter(
        item => this.getStatus(item.statut) === this.getStatus(b)
      );

    if (c != "default")
      this.bon$ = this.bon$.filter(
        item => item.type === c
      );
    if (d != null)
      this.bon$ = this.bon$.filter(
        item => this.format(new Date(item.date)) == this.format(d)
      )
    if (f != null && d != null) {
      this.filter(a, b, c, null, f);
      this.bon$ = this.bon$.filter(
        item => this.format(new Date(item.date)) >= this.format(d) && this.format(new Date(item.date)) <= this.format(f)
      )
    }

    this.bon$.forEach(value =>
      this.cat.push(value.nomCategorie)
    )

    this.cat = this.cat.filter(function (elem, index, self) {
      return index === self.indexOf(elem);
    })
  }
  format(a) {
    return this.datePipe.transform(a, 'dd/MM/yyyy')
  }

  select1(value) {
    this.nomcatbon = value;
    this.filter(this.nomcatbon, this.statusbon, this.typebon, this.datedeb, this.datefin)
  }

  select2(value) {
    this.statusbon = value;
    this.filter(this.nomcatbon, this.statusbon, this.typebon, this.datedeb, this.datefin)
  }

  select3(value) {
    this.typebon = value;
    this.filter(this.nomcatbon, this.statusbon, this.typebon, this.datedeb, this.datefin)
  }

  filterDateDeb(value) {
    this.datedeb = value;
    this.filter(this.nomcatbon, this.statusbon, this.typebon, this.datedeb, this.datefin)

  }
  filterDateFin(value) {
    this.datefin = value,
      this.filter(this.nomcatbon, this.statusbon, this.typebon, this.datedeb, this.datefin)

  }
  getStatus(stat: number) {
    if (stat == 0)
      return "Crée"
    else if (stat == 1)
      return "En Cours"
    else if (stat == 2)
      return "Traité"

  }


  clean() {
    this.datedeb = new Date();
    this.datefin = null;
    this.nomcatbon = "default";
    this.statusbon = "default";
    this.typebon = "default";
    this.AllBonCommande = false;
    this.filter(this.nomcatbon, this.statusbon, this.typebon, this.datedeb, this.datefin)
  }

  ShowAllBons() {
    this.datedeb = null;
    this.datefin = null;
    this.AllBonCommande = !this.AllBonCommande;
    if (this.AllBonCommande) {
      this.filter(this.nomcatbon, this.statusbon, this.typebon, this.datedeb, this.datefin);
    }
    else {
      this.datedeb = new Date();
      this.filter(this.nomcatbon, this.statusbon, this.typebon,this.datedeb, null);
    }
  }






  loading2: boolean = false
  getListeCommande(id: string, i: number) {
    this.diplay = true
    this.loading2 = true
    this._bonCommandeService.findByIdBonCommandeAllCommandes(id).subscribe(val => {
      if (val.objectResponse != null) {
        if (this.ListeBonCommande[i].ListeCommandes == null)
          this.ListeBonCommande[i].ListeCommandes = val.objectResponse;
          this.bon$[i].ListeCommandes = this.ListeBonCommande[i].ListeCommandes;
      }
      this.loading2 = false
      
    })
    
  }
  loading3: boolean = false
  getListeDetailCommande(idc: String, idbc, j: number) {

    this.loading3 = true
    this._bonCommandeService.findByIdCommandeAllDetailCommande(idc).subscribe(val => {
      if (val.objectResponse != null) {
        var i = this.ListeBonCommande.findIndex(obj => obj.idBonCommande == idbc);
        if (this.ListeBonCommande[i].ListeCommandes != null) {
          if (this.ListeBonCommande[i].ListeCommandes[j].ListeDetailCommande == null) {
            this.ListeBonCommande[i].ListeCommandes[j].ListeDetailCommande = val.objectResponse;
          }
        }
      }
      this.loading3 = false;
    })

  }
  addBonCommande() {
    this.route.navigateByUrl("/pages/Pointvente/gestionBonCommandePv/NouvelleBonCommandePv");
  }
  deleteBonCommande(id: String) {
    this._bonCommandeService.deleteBonCommande(id).subscribe(val => {
      if (val.result == 1) {
        this.ListeBonCommande = this.ListeBonCommande.filter(val => val.idBonCommande != id);
        this._GlobalService.showToast("success", "success", "la Bon Commande ete supprimé avec succès")
      } else {
        this._GlobalService.showToast("danger", "Erreur", val.errorDescription)

      }
    }, erreur => {
      this._GlobalService.showToast("danger", "Erreur", "erreur")

    })
  }
  deleteCommande(id: String, rb: number, j: number) {
    this._bonCommandeService.deleteCommande(id).subscribe(val => {
      if (val.result == 1) {
        this.ListeBonCommande[rb].ListeCommandes.splice(j, 1);
        this._GlobalService.showToast("success", "success", "Commande supprimé avec succès")
      } else {
        this._GlobalService.showToast("danger", "Erreur", val.errorDescription)

      }
    }, erreur => {
      this._GlobalService.showToast("danger", "Erreur", "erreur")

    })
  }
  getData(id:String){
    return this._bonCommandeService.findByIdCommandeAllDetailCommande(id);
  }

  Envoyer(bon: BonCommandePv) {
    let find = true
    let i

     this._bonCommandeService.findByIdBonCommandeAllCommandes(bon.idBonCommande).subscribe(async val => {
      if (val.objectResponse.length > 0) {
        i=val.objectResponse.length
         val.objectResponse.forEach(async value =>{
           i--
           var response = await this.getData(value.idCommandePv).toPromise();
           if (response.objectResponse.length <= 0) {
            find=false
            this._GlobalService.showToast("danger", "Erreur", "commande vide");

           }
           else if(i<=0 && find){
             this.update(bon);
           }
           i++
        }
        )


      }
      else{
        this._GlobalService.showToast("danger", "Erreur", "Bon Commande Vide")
      }
    });
   


  }
  

  update(bon: BonCommandePv) {
    bon.statut=1;
    this._bonCommandeService.updateBonCommande(bon).subscribe(respone => {
      if (respone.result == 1) {
        
        let index = this.ListeBonCommande.findIndex(val => val.idBonCommande == bon.idBonCommande);
        this.ListeBonCommande[index].statut = 1;
        this._GlobalService.showToast("success", "success", "la Bon Commande ete confirmer avec succès")
      } else {
        this._GlobalService.showToast("danger", "Erreur", respone.errorDescription)

      }
    }, erreur => {
      this._GlobalService.showToast("danger", "Erreur", "erreur")

    })
  }
  
  detaili: number;
  bonci: number;
  comi: number;
  clonedProducts: { [s: string]: DetailCommandePv; } = {}
  onRowEditInit(detail: DetailCommandePv, rb: number, rc: number, ri: number, idcat: String) {
    
    if (detail.idDetailPV != null) {
      //let bonci = this.ListeBonCommande.findIndex(val=>val.idBonCommande==idb);
      //let comi = this.ListeBonCommande[bonci].ListeCommandes.findIndex(val=>val.idCommandePv==idc);
      //let detaili = this.ListeBonCommande[bonci].ListeCommandes[comi].ListeDetailCommande.findIndex(val=>detail==val);
      let index = parseInt(rb.toString() + rc.toString() + ri.toString());
      this.clonedProducts[index] = { ...detail };
    }
  }

  onRowEditSave(detail: DetailCommandePv, index: number, rb: number, rc: number, idc: String) {
    
    if (detail.quantiteDemande > 0) {
      if (detail.idDetailPV == null) {
        if (this.selectedprod != null) {
          detail.nomProduit = this.selectedprod.designation;
          detail.idProduit = this.selectedprod.idProduit;
          detail.idCommandePV = idc;
          
          this._bonCommandeService.createDetailCommandePv(detail).subscribe(response => {
            if (response.result == 1) {
              //let bonci = this.ListeBonCommande.findIndex(val=>val.idBonCommande==idb);
              //let comi = this.ListeBonCommande[bonci].ListeCommandes.findIndex(val=>val.idCommandePv==idc);
              this.ListeBonCommande[rb].ListeCommandes[rc].ListeDetailCommande[index].idDetailPV = response.objectResponse.idDetailPV;
              this.selectedprod = null;
              this._GlobalService.showToast("success", "success", "Produit ajouter ");
            } else {
              this._GlobalService.showToast("danger", "Erreur", response.errorDescription);
              this.ddetails.initRowEdit(detail);


            }
          });
        }
        else {
          this._GlobalService.showToast("danger", "Erreur", 'Produit Vide');
          this.ddetails.initRowEdit(detail);
        }
      } else {
        this._bonCommandeService.updateDetailCommande(detail).subscribe(response => {
          if (response.result == 1) {
            
            this._GlobalService.showToast("success", "success", "Detail commande mise a jour")
          }
          else {
            this._GlobalService.showToast("danger", "Erreur", response.errorDescription)
          }
        }, erreur => {
          this._GlobalService.showToast("danger", "Erreur", "erreur")

        });
      }
    }
    else {
      this._GlobalService.showToast("danger", "Erreur", "Quanité doit etre superieur a 0");
      this.ddetails.initRowEdit(detail);
    }
  }

  onRowEditCancel(detail: DetailCommandePv, ind: number, rb: number, rc: number) {
    // let bonci = this.ListeBonCommande.findIndex(val=>val.idBonCommande==idb);
    // let comi = this.ListeBonCommande[bonci].ListeCommandes.findIndex(val=>val.idCommandePv==idc);
    let index = parseInt(rb.toString() + rc.toString() + ind.toString());
    if (detail.idDetailPV != null) {
      this.ListeBonCommande[rb].ListeCommandes[rc].ListeDetailCommande[ind] = this.clonedProducts[index];
      delete this.clonedProducts[index];
    } else {
      this.ListeBonCommande[rb].ListeCommandes[rc].ListeDetailCommande.splice(ind, 1);
    }
  }
  deleteDetailCommande(detail: DetailCommandePv, index: number, rb: number, rc: number) {
    this._bonCommandeService.deleteDetailCommande(detail.idDetailPV).subscribe(response => {
      if (response.result == 1) {
        //let bonci = this.ListeBonCommande.findIndex(val=>val.idBonCommande==idb);
        //let comi = this.ListeBonCommande[bonci].ListeCommandes.findIndex(val=>val.idCommandePv==detail.idCommandePV);
        this.ListeBonCommande[rb].ListeCommandes[rc].ListeDetailCommande.splice(index, 1);
        this._GlobalService.showToast("success", "success", "Detail Commande supprimé avec succès")
      } else {
        this._GlobalService.showToast("danger", "Erreur", response.errorDescription)

      }
    }, erreur => {
      this._GlobalService.showToast("danger", "Erreur", "erreur")

    });
  }
  //Add Row
  Adding: boolean = false;
  @ViewChild('ddetails', { static: false }) private ddetails: Table;

  addRowDetailCommande(idc: String) {
    this.getAllProduitByIdCategorie(idc, this.idpointVente);
    let detail: DetailCommandePv = new DetailCommandePv;
    detail.idCommandePV = idc;
    detail.quantiteDemande = 0;
    detail.quantiteLivree = null;
    detail.quantiteRestante = null;
    this.ddetails.value.push(detail);
    this.ddetails.initRowEdit(detail);
  }
  ListeProduit: Prodcut[] = [];
  selectedprod: Prodcut;
  keyword = 'designation';
  getAllProduitByIdCategorie(idc: String, idpv: String) {
    this._produitService.findAllProductByIdCategorieArticleAndIdPointVente(idc, idpv).subscribe(val => {
      if (val.objectResponse != null) {
        this.ListeProduit = [];
        val.objectResponse.forEach(element => {
          if (element != null)
            this.ListeProduit.push(element);

        });
        

      }
    })

  }
  selectEvent(item) {
    this.selectedprod = item;
  }


  onChangeSearch(val: string) {
    // fetch remote data from here
    // And reassign 'data' which is binded to 'data' property.
  }

  onFocused(e) {
    //
  }

}

