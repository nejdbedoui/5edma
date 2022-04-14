import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProduitProintVenteEndPointService } from '../../../../service/bp-api-product/produit-proint-vente-end-point/produit-proint-vente-end-point.service';
import { Produitpointvente } from '../../../../model/Produitpointvente';
import { VProduitProduitpointvente } from '../../../../model/VProduitProduitpointvente';
import { MvtStock } from '../../../../model/MvtStock';
import { MvtStockEndPointService } from '../../../../service/bp-api-product/mvt-stock-end-point/mvt-stock-end-point.service';
import { GlobalServiceService } from '../../../../service/GlobalService/global-service.service';
import { FournisseurDto } from '../../../../model/dto/FournisseurDto';
import { FournisseurEndPointService } from '../../../../service/bp-api-product/fournisseur-end-point/fournisseur-end-point.service';
import { Fournisseur } from '../../../../model/dto/Fournisseur';
import { PointVenteEndPointService } from '../../../../service/bp-api-pos/point-vente-end-point/point-vente-end-point.service';
import { PointVente } from '../../../../model/PointVente';
import { MvtStockDto } from '../../../../model/dto/mvtStockDto';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'ngx-create-mouvement',
  templateUrl: './create-mouvement.component.html',
  styleUrls: ['./create-mouvement.component.scss'],
  providers: [MessageService]
})
export class CreateMouvementComponent implements OnInit {

  constructor(private _FormBuilder: FormBuilder, private router: Router,
    private _ProduitProintVenteEndPointService: ProduitProintVenteEndPointService, private _MvtStockEndPointService: MvtStockEndPointService,
    private _GlobalService: GlobalServiceService, private _FournisseurEndPointService: FournisseurEndPointService,
    private _PointVenteEndPointService: PointVenteEndPointService, private messageService: MessageService) { }
  mvtForm: FormGroup;
  isSubmitted2: boolean = false
  produit: VProduitProduitpointvente = new VProduitProduitpointvente()
  produits: VProduitProduitpointvente[] = []

  operation = [{ label: 'entre', value: '+' }, { label: 'sortie ', value: '-' }];
  Types = [{ label: 'Recepetion fournisseur', value: 'recepetion fournisseur' }, { label: 'Correction Stock', value: 'correction Stock' }, { label: 'Transfert', value: 'transfert' }, { label: 'Mouvement Lab', value: 'Mouvement Lab' }, { label: 'Autre', value: 'autre' },];
  public calendar: any;
  calendar_fr = {
    closeText: "Fermer",
    prevText: "Précédent",
    nextText: "Suivant",
    currentText: "Aujourd'hui",
    monthNames: ["janvier", "février", "mars", "avril", "mai", "juin",
      "juillet", "août", "septembre", "octobre", "novembre", "décembre"],
    monthNamesShort: ["janv.", "févr.", "mars", "avr.", "mai", "juin",
      "juil.", "août", "sept.", "oct.", "nov.", "déc."],
    dayNames: ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"],
    dayNamesShort: ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."],
    dayNamesMin: ["D", "L", "M", "M", "J", "V", "S"],
    weekHeader: "Sem.",
    dateFormat: "dd-mm-yy",
    firstDay: 1,
    isRTL: false,
    showMonthAfterYear: false,
    yearSuffix: ""
  };
  fournisseurDto: FournisseurDto = new FournisseurDto()
  listfourni: Fournisseur[] = []
  gestionfournisseur: boolean = false
  listpointvente: PointVente[] = [];
  convesionTypes = [{ label: 'Kg', value: 'kg' }, { label: 'Litre ', value: 'litre' }]
  montantTypes = [{ label: 'TTC', value: 'TTC' }, { label: 'HT ', value: 'HT' }]
  checkPrixVente: boolean = false;
  public displayScan: boolean;
  codeBarre: String;

  ngOnInit() {
    this._PointVenteEndPointService.findAllByIdPartenaireBprice(localStorage.getItem("partenaireid")).subscribe(val => {
      this.listpointvente = val.objectResponse
      this.listpointvente = this.listpointvente.filter(el => el.idPointVente != localStorage.getItem("pointventeid"))
    })
    this._FournisseurEndPointService.findAllByIdPatenaireBprice(localStorage.getItem("partenaireid")).subscribe(val => {
      this.listfourni = val.objectResponse != null ? val.objectResponse : []
    })
    this.calendar = this.calendar_fr
    this.mvtForm = this._FormBuilder.group({
      sens: [this.operation[0].value, [Validators.required]],
      quantite: ['', [Validators.required]],
      date: [new Date],
      type: [this.Types[0].value, [Validators.required]],
      montant: [],
      note: [],
      pv: [],
      fournissuer: [],
      convesionQuantite: [],
      prix: [],
      isconvesion: [false],
      convesionType: ['kg'],
      montantTypes: ['TTC'],
      tva: [],

    })
    this._ProduitProintVenteEndPointService.findAllProduitPointVenteByIdPointVente(localStorage.getItem("pointventeid")).subscribe(val => {
      this.produits = val.objectResponse
      this.produits = this.produits.filter(prod => prod.typeProduit == "stockable")
      console.log(this.produit);

    })
    this.displayScan = false;
  }

  keyword = 'designation';
  get formControls() { return this.mvtForm.controls; }
  verifnote: boolean = false
  verifpv: boolean = false
  veriffr: boolean = false
  loading: boolean = false
  createmvt() {
    this.isSubmitted2 = true
    if ((this.mvtForm.value.type == "autre" || this.mvtForm.value.type == "correction Stock" || this.mvtForm.value.type == "Mouvement Lab") && this.mvtForm.value.note == null) {
      this.verifnote = true
    } else {
      this.verifnote = false
    }

    if (this.mvtForm.value.type == "transfert") {
      if (this.mvtForm.value.pv == null) {
        this.verifpv = true
      } else {
        this.verifpv = false
      }
      console.log(this.mvtForm.value.prix == null);

      if (this.mvtForm.value.prix == null || this.mvtForm.value.prix == '') {
        this.checkPrixVente = true;
      } else {
        this.checkPrixVente = false;
      }
    } else {
      this.verifpv = false;
      this.checkPrixVente = false;
    }
    console.log(this.mvtForm);

    if (this.mvtForm.value.type == "recepetion fournisseur") {
      if (this.mvtForm.value.fournissuer == null) {
        this.veriffr = true

      } else {
        this.veriffr = false
      }
    } else {
      this.veriffr = false
    }

    if (this.mvtForm.invalid || this.verifnote || this.verifpv || this.veriffr || this.checkPrixVente) {
      return
    } else {
      this.loading = true
      let mvtstock: MvtStock = new MvtStock()
      mvtstock.dateMvt = new Date()
      mvtstock.quantite = this.mvtForm.value.quantite
      mvtstock.sens = this.mvtForm.value.sens
      mvtstock.idProduitProintVente = this.produit.produitpointvente.idproduitPointVente
      mvtstock.type = this.mvtForm.value.type
      mvtstock.motif = this.mvtForm.value.note
      mvtstock.valeur = this.mvtForm.value.montant

      if (this.mvtForm.value.type == "transfert") {
        mvtstock.idPointVenteSource = localStorage.getItem("pointventeid")
        mvtstock.idPointVenteDest = this.mvtForm.value.pv

        mvtstock.isConversion = this.mvtForm.value.isconvesion;
        mvtstock.qteConversion = this.mvtForm.value.convesionType ? this.mvtForm.value.convesionQuantite : null;
        if (this.mvtForm.value.isconvesion)
          mvtstock.mesureConversion = this.mvtForm.value.convesionType;
        if (this.mvtForm.value.montantTypes == "HT") {
          mvtstock.tva = this.mvtForm.value.tva;
          mvtstock.prixVente = this.mvtForm.value.prix + (this.mvtForm.value.prix * this.mvtForm.value.tva / 100);
        }
        else
          mvtstock.prixVente = this.mvtForm.value.prix;

      } else if (this.mvtForm.value.type == "recepetion fournisseur") {
        console.log(this.mvtForm.value.fournissuer);

        if (this.mvtForm.value.fournissuer.idFournisseur == null) {
          this.mvtStockDto.fournisseur = this.mvtForm.value.fournissuer
        } else {
          console.log(this.mvtForm.value.fournissuer);

          mvtstock.idFournisseur = this.mvtForm.value.fournissuer.idFournisseur

        }
      }
      this.mvtStockDto.mvtStock = mvtstock
      console.log(this.mvtStockDto);
      this._MvtStockEndPointService.CreateMvtStock(this.mvtStockDto).subscribe(val => {
        console.log(val)
        if (val.result == 1) {
          this._GlobalService.showToast('success', "success", "le mouvement de stock a été ajouté avec succès")
          this.annuler()
        } else {
          this._GlobalService.showToast('danger', "Erruer", val.errorDescription)
          this.loading = false
          //this.annuler()
        }
      }, erruer => {
        this._GlobalService.showToast('danger', "Erruer", "Un problème de connection est survenue, Veuillez réessayer ulterieurement")
        this.loading = false
        //this.annuler()
      })
    }
  }
  mvts: MvtStock[] = []
  mvtStockDto: MvtStockDto = new MvtStockDto()
  selectEvent(item) {
    this.produit = item
    this._MvtStockEndPointService.findTop5ByIdProduitProintVenteOrderByDateMvt(this.produit.produitpointvente.idproduitPointVente).subscribe(val => {
      this.mvts = val.objectResponse
      console.log(this.mvts);

    })
    console.log(this.produit);

    // do something with selected item
  }

  onChangeSearch(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }
  cleardata(event) {
    this.produit = new VProduitProduitpointvente()
  }

  onFocused(e) {
    // do something when input is focused
  }
  annuler() {
    this.router.navigateByUrl("/pages/Pointvente/gestionMouvement")
  }

  isSubmitfournisseur: boolean = false
  istelvalid: boolean = false
  isnamevalid: boolean = false
  isemailvalid: boolean = false
  listfournisseur: FournisseurDto[] = []
  addfourinsseur() {
    this.isSubmitfournisseur = true
    if (this.fournisseurDto.tel == null || this.fournisseurDto.tel == '') {
      this.istelvalid = true
    } else {
      this.istelvalid = false
    }
    if (this.fournisseurDto.nom == null || this.fournisseurDto.nom == '') {
      this.isnamevalid = true
    } else {
      this.isnamevalid = false
    }
    var EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    console.log(EMAIL_REGEXP.test(this.fournisseurDto.email));

    if ((this.fournisseurDto.email != null && this.fournisseurDto.email != '') && !EMAIL_REGEXP.test(this.fournisseurDto.email)) {
      this.isemailvalid = true
    } else {
      this.isemailvalid = false
    }
    if (!this.istelvalid && !this.isnamevalid && !this.isemailvalid) {

      if (this.listfournisseur.filter(el => el.id == this.fournisseurDto.id).length > 0) {
        // this.showToast('danger',"Echec","ce Fournisseur a été déja sélectionner");
      } else {
        let fourin: Fournisseur = new Fournisseur()
        fourin.nom = this.fournisseurDto.nom
        fourin.societe = this.fournisseurDto.societe
        fourin.tel = this.fournisseurDto.tel
        fourin.email = this.fournisseurDto.email
        fourin.fAlerte = this.fournisseurDto.falerter ? 1 : 0
        fourin.fdefaut = this.fournisseurDto.fdefault ? 1 : 0
        fourin.idPatenaireBprice = localStorage.getItem("partenaireid")


        console.log(fourin);
        this.listfourni.push(fourin)
        this.cleardata2()
        this.gestionfournisseur = false
        this.fournisseurDto = new FournisseurDto()
      }


    }

  }
  cleardata2() {
    this.fournisseurDto = new FournisseurDto()

  }

  changeType(event) {
    if (event == "transfert") {
      this.mvtForm.controls.sens.setValue('-');
    }
  }
  showError() {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Aucun Produit correspondant au code à barre entré !' });
  }
  checkCodeBar() {

    let codeP = this.codeBarre.substring(2, 7);
    let poidsC = this.codeBarre.substring(7, 12);
    let conv = parseFloat(poidsC) / 1000
    console.log(codeP)
    console.log(poidsC)
    var produitRepl = []
    produitRepl = this.produits.filter(prod => prod.codeBarre == codeP)
    console.log('test' + this.produits)
    if (produitRepl != null && produitRepl.length > 0) {
      this.selectEvent(produitRepl[0]);

      this.mvtForm.controls.type.setValue("transfert");
      this.changeType('transfert');
      if (conv != null) {
        this.mvtForm.controls.quantite.setValue(conv);
        this.mvtForm.controls.isconvesion.setValue(true);
        this.mvtForm.controls.convesionQuantite.setValue(conv);
      }
    } else {
      this.codeBarre = '';
      this.produit.designation = '';
      this.showError();
    }
  }
}
