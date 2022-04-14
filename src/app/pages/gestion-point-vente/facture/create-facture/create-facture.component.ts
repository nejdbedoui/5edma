import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CalenderConst } from '../../../../const/calenderConst';
import { BonCommande } from '../../../../model/BonCommande';
import { Facture } from '../../../../model/Facture';
import { MvtStock } from '../../../../model/MvtStock';
import { MvtStockProduct } from '../../../../model/MvtStockProduct';
import { PartenaireBprice } from '../../../../model/PartenaireBprice';
import { PointVente } from '../../../../model/PointVente';
import { PartenaireBpriceEndPointService } from '../../../../service/bp-api-pos/partenaire-bprice-end-point/partenaire-bprice-end-point.service';
import { PointVenteEndPointService } from '../../../../service/bp-api-pos/point-vente-end-point/point-vente-end-point.service';
import { BonCommandeService } from '../../../../service/bp-api-product/bon-commande/bon-commande.service';
import { FactureService } from '../../../../service/bp-api-product/facture-end-point/facture.service';

@Component({
  selector: 'ngx-create-facture',
  templateUrl: './create-facture.component.html',
  styleUrls: ['./create-facture.component.scss']
})
export class CreateFactureComponent implements OnInit {

  constructor(private pointVenteEndPointService: PointVenteEndPointService,
    private bonCommandeService: BonCommandeService, 
    private formBuilder: FormBuilder,
    private partenaireBpriceEndPointService: PartenaireBpriceEndPointService,
    private factureService: FactureService) { }

  factureForm: FormGroup
  loading: boolean = false
  isFormSubmitted: boolean = false;
  calendar = new CalenderConst().calendar_fr;
  listStatus: Array<string> = [];
  pvts: Array<PointVente> = [];
  bonCommandes: Array<BonCommande> = [];
  selectedBonCommande: Array<BonCommande> = [];
  display: boolean = false;
  currentFacture: Facture = new Facture();
  status = [{ label: 'Payer', value: '1' }, { label: 'No payée ', value: '0' }];
  partenaire: PartenaireBprice;
  isSubmitted: boolean = false;

  ngOnInit() {
    this.setForm();
    this.getListPointVentes();
    this.getPartenaireById();
  }

  private getListPointVentes() {
    this.pointVenteEndPointService.findAllByIdPartenaireBprice(localStorage.getItem("partenaireid")).subscribe(val => {
      this.pvts = val.objectResponse ? val.objectResponse : [];
    })
  }

  setForm() {
    this.factureForm = this.formBuilder.group({
      date: [ , [Validators.required]],
      pvt: [ , [Validators.required]],
      status: [, [Validators.required]]
    })
  }

  get formControls() { return this.factureForm.controls; }

  addFacture() {
    this.isSubmitted = true;
    if(this.factureForm.invalid || this.selectedBonCommande.length == 0){
      return;
    }
    this.currentFacture.dateGeneration = this.factureForm.value.date
    this.currentFacture.idPointvente = this.factureForm.value.pvt;
    this.currentFacture.montantHt = this.countHtPrice()
    this.currentFacture.montantTtc = this.countTtcPrice(this.currentFacture.montantHt, this.countTva())
    this.currentFacture.statut = this.factureForm.value.status
    this.currentFacture.id = this.factureForm.value.id
    this.currentFacture.bonCommandes = this.selectedBonCommande.map(bc => bc.id);
    this.currentFacture.idPartenaire = localStorage.getItem("partenaireid");
    this.display = true;

  }

  private countHtPrice() :number {
    console.log(this.selectedBonCommande);
    
    return this.selectedBonCommande.reduce((previousValue, bc) => previousValue + this.countMvtPrice(bc.mvtStockProducts), 0)
  }

  private countMvtPrice(mvtStockProduct: MvtStockProduct[]): number {
    return mvtStockProduct.reduce((previousValue, mvt)=> previousValue + this.getMvtPrice(mvt.mvtStock),0);
  }

  private getMvtPrice(mvtStock: MvtStock): number {
    if(mvtStock.tva!= null && mvtStock.tva != 0) {
      return mvtStock.tva * mvtStock.prixVente;
    }
    return mvtStock.prixVente
  }

  private countTva() :number {
    return this.selectedBonCommande.reduce((previousValue, bc) => previousValue + this.countMvtTva(bc.mvtStockProducts), 0)
  }

  private countMvtTva(mvtStockProduct: MvtStockProduct[]): number {
    return mvtStockProduct.reduce((previousValue, mvt)=> previousValue + this.getMvtTva(mvt.mvtStock),0);
  }

  private getMvtTva(mvtStock: MvtStock): number {
    return mvtStock.tva || 0;
  } 

  private countTtcPrice(htPrice: number, tva: number) :number {
    return htPrice + tva;
  }

  returnToList() {

  }

  selectPointVente(idPointVente: string) {
    this.getBonLiverationByPointVente(idPointVente);
  }

  getBonLiverationByPointVente(idPointVente: string) {
    this.bonCommandeService.findAllByIdPointVente(idPointVente).subscribe(val => {
      this.bonCommandes = val.objectResponse ? val.objectResponse : [];
    })
  }

  private getPartenaireById() {
    this.partenaireBpriceEndPointService.findByIdPartenaire(localStorage.getItem("partenaireid")).subscribe(val => {
      this.partenaire = val.objectResponse;
    })
  }

  private getStatusLabel(statusValue: number) {
    if(statusValue)
      return this.status.find(el => parseInt(el.value) == statusValue).label;
  }

  valider() {
    this.display = false;
    this.factureService.CreateFacture(this.currentFacture).subscribe(val =>{
      this.generatePdf(val.objectResponse.numFacture);
    })
  }

  generatePdf(refeance: string) {
    let selectedPv : PointVente = this.pvts.find(pvt => pvt.idPointVente == this.currentFacture.idPointvente)
    import("jspdf").then(jsPDF => {
      import("jspdf-autotable").then(x => {
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
        doc.text("Référence :      " + refeance, 40, 160);
        doc.text("Date Géneration :     " + new Date(this.currentFacture.dateGeneration).toLocaleDateString(), 40, 180);
        doc.text('PV : ' + selectedPv.designation, 3 * width / 4, 140, { align: 'center' });
        doc.text(new Date().toLocaleDateString() + " - " + new Date().toLocaleTimeString(), 2.5 * width / 4, 160), { align: 'center' };
        doc.line(50, 230, width - 50, 230);
        doc.line(50, 231, width - 50, 231);

        doc.text("Total HT:   " + this.currentFacture.montantHt + 'DT' , 380, 280);
        doc.text("Total TVA:   " + (this.currentFacture.montantTtc - this.currentFacture.montantHt) + 'DT'  , 380, 300);
        doc.text("Total TTC:   " + this.currentFacture.montantTtc + 'DT' , 380, 320);
        doc.text("Statut:   " + this.getStatusLabel(this.currentFacture.statut) , 380, 360);

        doc.text("Bon livraison :           " , 40, 260); 
        let index = 280;
        this.selectedBonCommande.forEach(el =>{
          doc.text(el.referance, 60, index );
          index = index + 25;           
        })
        var str = "Page 1";
        doc.text(str, width - 100, doc.internal.pageSize.height - 15);//key is the interal pageSize function

        doc.save('Facture_' + refeance + '_' + new Date().toLocaleString() + '.pdf');
      })
    })
  }
}
