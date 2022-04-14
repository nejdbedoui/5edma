import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CalenderConst } from '../../../const/calenderConst';
import { BonCommande } from '../../../model/BonCommande';
import { Facture } from '../../../model/Facture';
import { PartenaireBprice } from '../../../model/PartenaireBprice';
import { PointVente } from '../../../model/PointVente';
import { PartenaireBpriceEndPointService } from '../../../service/bp-api-pos/partenaire-bprice-end-point/partenaire-bprice-end-point.service';
import { PointVenteEndPointService } from '../../../service/bp-api-pos/point-vente-end-point/point-vente-end-point.service';
import { BonCommandeService } from '../../../service/bp-api-product/bon-commande/bon-commande.service';
import { FactureService } from '../../../service/bp-api-product/facture-end-point/facture.service';
import { DateService } from '../../../service/GlobalService/DateSevice/date.service';

@Component({
  selector: 'ngx-facture',
  templateUrl: './facture.component.html',
  styleUrls: ['./facture.component.scss']
})
export class FactureComponent implements OnInit {

  constructor(private router: Router,
    private _DateService: DateService,
    private factureService: FactureService,
    private bonCommandeService: BonCommandeService,
    private pointVenteEndPointService: PointVenteEndPointService,
    private partenaireBpriceEndPointService: PartenaireBpriceEndPointService) { }

  listFacture: Array<Facture> = [];
  loading: boolean = false;
  affichefilter: boolean = false;
  fannule: boolean = false;
  calendar = new CalenderConst().calendar_fr;
  status = [{ label: 'Payer', value: '1' }, { label: 'No payée ', value: '0' }];
  pvts: Array<PointVente> = [];
  partenaire: PartenaireBprice;
  bcs: Array<BonCommande> = [];
  diplay: boolean = false;
  currentfacture :Facture =new Facture();
  initListFacture: Array<Facture> = [];
  numFacture: string;
  pvt: PointVente;
  state:number;
  startDate: Date;
  endDate: Date;

  ngOnInit() {
    this.getFactureByPartenaire();
    this.getListPointVentes();
    this.getPartenaireById();
  }

  private getFactureByPartenaire() {
    this.factureService.findByIdpartenaire(localStorage.getItem('partenaireid')).subscribe(val => {
      this.listFacture = val.objectResponse ? val.objectResponse : [];
      this.initListFacture = val.objectResponse ? val.objectResponse : [];
    })
  }

  private getListPointVentes() {
    this.pointVenteEndPointService.findAllByIdPartenaireBprice(localStorage.getItem("partenaireid")).subscribe(val => {
      this.pvts = val.objectResponse ? val.objectResponse : [];
    })
  }

  private getPartenaireById() {
    this.partenaireBpriceEndPointService.findByIdPartenaire(localStorage.getItem("partenaireid")).subscribe(val => {
      this.partenaire = val.objectResponse;
    })
  }

  private async findBonCommandes(bcIds: Array<string>) {
    await this.bonCommandeService.findAllByBonCommandeList(bcIds).toPromise().then(val => {
      this.bcs = val.objectResponse ? val.objectResponse : [];
    })
  }

  findPvt(idPvt): PointVente {
    return this.pvts.find(el => el.idPointVente == idPvt)
  }

  addFacture() {
    this.router.navigateByUrl("/pages/Pointvente/facturation/NouvelleFacture");
  }


  getStatusLabel(statusValue: number) {
    if (statusValue != null)
      return this.status.find(el => el.value == statusValue.toString()).label;
  }

  downloadFacture(facture: Facture) {
    let selectedPv: PointVente = this.pvts.find(pvt => pvt.idPointVente == facture.idPointvente)
    import("jspdf").then(jsPDF => {
      import("jspdf-autotable").then(async x => {
        const doc = new jsPDF.default("p", "pt");
        var width = doc.internal.pageSize.getWidth()
        doc.text(this.partenaire.abbreviation, width / 2, 35, { align: 'center' });
        doc.text(selectedPv.adresse, width / 2, 55, { align: 'center' });
        doc.line(0, 70, width, 70);
        doc.setDrawColor(0);
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(20, 100, 270, 110, 3, 3, 'FD');
        doc.text("Facture", 40, 120);
        doc.line(20, 130, 290, 130);
        doc.text("Référence :      " + facture.numFacture, 40, 160);
        doc.text("Date Géneration :     " + new Date(facture.dateGeneration).toLocaleDateString(), 40, 180);
        doc.text('PV : ' + selectedPv.designation, 3 * width / 4, 140, { align: 'center' });
        doc.text(new Date().toLocaleDateString() + " - " + new Date().toLocaleTimeString(), 2.5 * width / 4, 160), { align: 'center' };
        doc.line(50, 230, width - 50, 230);
        doc.line(50, 231, width - 50, 231);

        doc.text("Total HT:   " + facture.montantHt + 'DT', 380, 280);
        doc.text("Total TVA:   " + (facture.montantTtc - facture.montantHt) + 'DT', 380, 300);
        doc.text("Total TTC:   " + facture.montantTtc + 'DT', 380, 320);
        doc.text("Statut:   " + this.getStatusLabel(facture.statut), 380, 360);

        doc.text("Bon livraison :           ", 40, 260);
        let index = 280;
        await this.findBonCommandes(facture.bonCommandes);
        this.bcs.forEach(el => {
          doc.text(el.referance, 60, index);
          index = index + 25;
        })
        var str = "Page 1";
        doc.text(str, width - 100, doc.internal.pageSize.height - 15);//key is the interal pageSize function

        doc.save('Facture_' + facture.numFacture + '_' + new Date().toLocaleString() + '.pdf');
      })
    })
  }

  deleteFacture(facture: Facture) {
    this.currentfacture = facture;
    this.diplay = true;
  }

  patchFacture(facture: Facture) {
    this.factureService.patchFactureAsPayed(facture.id).subscribe(val => {
      facture.statut = 1;
    })
  }

  confirmeDeleteFacture() {
    this.factureService.DeleteFacture(this.currentfacture.id).subscribe(() => {
      this.diplay = false;
      this.listFacture = this.listFacture.filter(el=> el.id != this.currentfacture.id);
    })
  }


  search() {
    this.annuler();
    this.fannule = true;
    if(this.numFacture) this.listFacture = this.filterByNumFacture(this.numFacture, this.listFacture);
    if(this.pvt) this.listFacture = this.filterByPointVente(this.pvt, this.listFacture);
    if(this.state) this.listFacture = this.filterByStatus(this.state, this.listFacture);
    if(this.startDate && this.endDate){
      this.listFacture = this.filterBy2Date(this.startDate, this.endDate, this.listFacture);
    }else{
      if(this.startDate) this.listFacture = this.filterByDate(this.startDate, this.listFacture);
      if(this.endDate) this.listFacture = this.filterByDate(this.endDate, this.listFacture);
    }
  }

  annuler() {
    this.listFacture = [...this.initListFacture];
    this.fannule = false;
  }

  resetFilter() {
    this.numFacture = null;
    this.pvt = null;
    this.state = null;
    this.startDate = null;
    this.endDate = null;
  }

  private filterByPointVente(pv: PointVente, factures: Facture[]): Facture[] {
    return factures.filter(val => val.idPointvente == pv.idPointVente);
  }

  private filterByNumFacture(numfacture: string, factures: Facture[]): Facture[] {
    return factures.filter(val => val.numFacture == numfacture);
  }

  private filterByStatus(status: number, factures: Facture[]): Facture[] {
    return factures.filter(val => val.statut == status);
  }

  private filterByDate(date: Date, factures: Facture[]): Facture[] {
    return factures.filter(element => this._DateService.checkdate(date, element.dateGeneration));
  }

  private filterBy2Date(startDate: Date, endDate: Date, factures: Facture[]): Facture[] {
    console.log({startDate});
    console.log({endDate});
    return factures.filter(val => this._DateService.check2date(startDate, endDate, val.dateGeneration));
  }

}
