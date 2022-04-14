import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TableCaisseEndPointService } from '../../../service/bp-api-pos/table-caisse-end-point/table-caisse-end-point.service';
import { TableCaisse } from '../../../model/TableCaisse';
import { GlobalServiceService } from '../../../service/GlobalService/global-service.service';
import { CommandeDetailsDto } from '../../../model/dto/CommandeDetailsDto';
import { ProduitProintVenteEndPointService } from '../../../service/bp-api-product/produit-proint-vente-end-point/produit-proint-vente-end-point.service';
import { VProduitProduitpointvente } from '../../../model/VProduitProduitpointvente';
import { Table } from 'primeng/table';

@Component({
  selector: 'ngx-gestion-table',
  templateUrl: './gestion-table.component.html',
  styleUrls: ['./gestion-table.component.scss']
})
export class GestionTableComponent implements OnInit {

  constructor(private route:Router,private _TableCaisseEndPointService:TableCaisseEndPointService,
    private _GlobalService:GlobalServiceService, private _ProduitProintVenteEndPointService:ProduitProintVenteEndPointService) { }
  tables:TableCaisse[]=[]
  cols:any[]
  loading:boolean=true;
  loading1:boolean=false;
  displaymap:boolean=false;
  listtransactiondetails:CommandeDetailsDto[]=[];
  listproduit:VProduitProduitpointvente[]=[];
  selectedTable:TableCaisse;
  commande:any
  ngOnInit() {
    this.cols = [
      { field: 'Capacité de la Table', header: 'Capacité de la Table' },
      { field: 'Numéro de la Table', header: 'Numéro de la Table' },
      { field: 'Action', header: 'Action' },
  ];
  this.getProducts();
    this._TableCaisseEndPointService.findAllByIdPointVente(localStorage.getItem("pointventeid")).subscribe(val=>{
      this.loading=false
      if(val.result==1){
        this.tables=val.objectResponse
      }
    })
  }
  addtable(){
    this.route.navigateByUrl("/pages/Pointvente/gestionTable/NouvelleTable")
  }
  edittable(table:TableCaisse){
    this.route.navigateByUrl("/pages/Pointvente/gestionTable/updateTable/"+table.idTable)
  }
  deletetable(table:TableCaisse){

    this.tables=this.tables.filter(val=>val.idTable!=table.idTable);
    this._TableCaisseEndPointService.DeleteTableCaisse(table.idTable).subscribe(val=>{
      console.log(val);
      if(val.result==1){
        this._GlobalService.showToast("success","success","la table a ete supprimé avec succès")
      }
    })
  }
  commandeDetails(table:TableCaisse){
    this.listtransactiondetails=table.commandeDetails;
    this.commande=table.commande;
    this.selectedTable=table
    this.displaymap=true;
  }

  getProducts(){
    this._ProduitProintVenteEndPointService.findAllProduitPointVenteByIdPointVente(localStorage.getItem("pointventeid")).subscribe(val=>{
      console.log(val);
      this.listproduit=val.objectResponse
    })
  }
  getproduitname(idp){  
    return this.listproduit.find(el=>el.idProduit==idp)
    }

}
