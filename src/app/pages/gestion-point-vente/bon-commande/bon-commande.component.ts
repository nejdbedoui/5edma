import { Component, OnInit } from '@angular/core';
import autoTable from 'jspdf-autotable';
import { BonCommande } from '../../../model/BonCommande';
import { PartenaireBprice } from '../../../model/PartenaireBprice';
import { PointVente } from '../../../model/PointVente';
import { PartenaireBpriceEndPointService } from '../../../service/bp-api-pos/partenaire-bprice-end-point/partenaire-bprice-end-point.service';
import { PointVenteEndPointService } from '../../../service/bp-api-pos/point-vente-end-point/point-vente-end-point.service';
import { BonCommandeService } from '../../../service/bp-api-product/bon-commande/bon-commande.service';

@Component({
  selector: 'ngx-bon-commande',
  templateUrl: './bon-commande.component.html',
  styleUrls: ['./bon-commande.component.scss']
})
export class BonCommandeComponent implements OnInit {

  constructor(private bonCommandeService: BonCommandeService, 
    private partenaireBpriceEndPointService: PartenaireBpriceEndPointService,
    private pointVenteEndPointService:PointVenteEndPointService ) { }
  bonCommandes:BonCommande[]=[]
  cols:any[]
  loading:boolean=true;
  partenaire: PartenaireBprice;
  pvts: PointVente[] =[];
  ngOnInit() {
    this.cols = [
      { field: 'Capacité de la Table', header: 'Capacité de la Table' },
      { field: 'Numéro de la Table', header: 'Numéro de la Table' },
      { field: 'Action', header: 'Action' },
  ];
  
    this.bonCommandeService.findAllByIdpartenaire(localStorage.getItem("partenaireid")).subscribe(val=>{
      this.loading=false
      if(val.result==1){
        this.bonCommandes=val.objectResponse
        this.bonCommandes=this.bonCommandes.sort((a,b)=>{
          return new Date(b.generatedDate).getTime()-new Date(a.generatedDate).getTime();
        })
      }
    })
    this.findPartenaire();
    this.findPv();
  }

  findPartenaire() {
    this.partenaireBpriceEndPointService.findByIdPartenaire(localStorage.getItem("partenaireid")).subscribe(val=>{
      this.partenaire = val.objectResponse;
    })
  }

  findPv() {
    this.pointVenteEndPointService.findAllByIdPartenaireBprice(localStorage.getItem("partenaireid")).subscribe(val=>{
      this.pvts = val.objectResponse;
    })
  }

  // exportPdf(bonCommande: BonCommande) {
  //   var min = 10000;
  //   var max = 80000;
  //   var num = Math.floor(Math.random() * min) + max;
  //   import("jspdf").then(jsPDF => {
  //     import("jspdf-autotable").then(x => {
  //       const doc = new jsPDF.default("p", "pt");
  //       doc.setDrawColor(0);
  //       doc.setFillColor(255, 255, 255);
  //       doc.roundedRect(20, 20, 300, 120, 3, 3, 'FD');
  //       doc.text("BON DE COMMANDE", 40, 47);
  //       doc.line(20, 60, 320, 60);
  //       doc.text("Référence :           "+bonCommande.referance, 40, 90);
  //       doc.text("Date :                    "+new Date(bonCommande.generatedDate).toLocaleDateString(), 40, 110);
  //       let rows : any[]= []

        
  //       bonCommande.mvtStocks.forEach(item =>{ 
  //           bonCommande.mvtStocks.push(item);
  //           let row: string[] = []
  //           row.push(String(item.quantite))
  //           row.push(item.mesureConversion)
  //           row.push(String(item.qteConversion))
  //           rows.push(row);
  //         })

  //       console.log(rows);
  //       autoTable(doc, {
  //         head: [['Désignation', 'Qte/portion', 'Unité', 'Qte(conversion)']],
  //         body: rows,
  //         margin: { top: 160 },
  //         styles: {overflow: 'ellipsize',
  //         fontSize: 10},
  //         theme: 'plain'
  //       });
  //       doc.save('bon_de_commande_'+bonCommande.referance+'.pdf');
  //     })
  //   })

  // }

  
  exportPdf(bonCommande: BonCommande) {
    var min = 10000;
    var max = 80000;
    var num = Math.floor(Math.random() * min) + max;

    let refeance = "LC0"+ num;
    import("jspdf").then(jsPDF => {
      import("jspdf-autotable").then(x => {
        const doc = new jsPDF.default("p", "pt");
        var width = doc.internal.pageSize.getWidth()
        doc.text(this.partenaire.abbreviation, width/2,35, { align: 'center' });
        doc.text(this.pvts.find(el => el.idPointVente == bonCommande.idPointVente).adresse, width/2,55, { align: 'center' });
        doc.line(0, 70, width, 70);
        doc.setDrawColor(0);
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(20, 100, 270, 110, 3, 3, 'FD');
        doc.text("BON DE COMMANDE", 40, 120);
        doc.line(20, 130, 290, 130);
        doc.text("Référence :           "+refeance, 40, 160);
        doc.text("Date :                    "+new Date().toLocaleDateString(), 40, 180);
        doc.text('PV : '+"this.selectedPv.designation", 3*width/4, 140, { align: 'center' });
        doc.text(new Date().toLocaleDateString()+" - "+new Date().toLocaleTimeString(),  2.5*width/4, 160), { align: 'center' };
        let rows : any[]= []

        let prixTotale=0;
          bonCommande.mvtStockProducts.forEach(item =>{ 
            let row: string[] = []
            row.push(item.productName);
            row.push(item.mvtStock.quantite?String(item.mvtStock.quantite):'');
            row.push(item.mvtStock.mesureConversion);
            row.push(item.mvtStock.qteConversion?String(item.mvtStock.qteConversion):'');
            row.push(item.mvtStock.prixVente?String(item.mvtStock.prixVente):'');
            rows.push(row);
          })
        doc.line(50, 230, width-50, 230);
        doc.line(50, 231, width-50, 231);
        autoTable(doc, {
          head: [['Désignation', 'Qte/portion', 'Unité', 'Qte(conversion)', 'Prix de vente']],
          body: rows,
          margin: { top: 240 },
          styles: {overflow: 'ellipsize',
          fontSize: 15},
          headStyles: {  fillColor: '#E8E8E8', textColor:'#000' },
          theme: 'grid'
        });
        
        doc.line(50, 270+(50*rows.length), width-50, 270+(50*rows.length));
        doc.line(50, 270+(50*rows.length)+1, width-50, 270+(50*rows.length)+1);
        // let finalY = (doc as any).getLastAutoTable().finalY;
        doc.text('Total : '+bonCommande.total, 3*width/4, 270+(50*rows.length)+20);
        var str = "Page 1";
        doc.text(str, width - 100, doc.internal.pageSize.height - 15);//key is the interal pageSize function

        doc.save('bon_de_commande_'+bonCommande.referance+'_'+new Date().toLocaleString()+'.pdf');
      })
    })

  }



}
