import { Component, OnInit } from '@angular/core';
import { ProductEndPointService } from '../../../service/bp-api-product/product-end-point/product-end-point.service';
import { Router } from '@angular/router';
import { GlobalServiceService } from '../../../service/GlobalService/global-service.service';
import { Prodcut } from '../../../model/Product';
import { ProduitProintVenteEndPointService } from '../../../service/bp-api-product/produit-proint-vente-end-point/produit-proint-vente-end-point.service';
import { VProduitProduitpointvente } from '../../../model/VProduitProduitpointvente';
import { PointVenteEndPointService } from '../../../service/bp-api-pos/point-vente-end-point/point-vente-end-point.service';
import { PointVente } from '../../../model/PointVente';
import { MvtStockEndPointService } from '../../../service/bp-api-product/mvt-stock-end-point/mvt-stock-end-point.service';
import { MvtStock } from '../../../model/MvtStock';
import { Produitpointvente } from '../../../model/Produitpointvente';
import { Categorie } from '../../../model/Categorie';
import { DateService } from '../../../service/GlobalService/DateSevice/date.service';
import { CategorieEndPointService } from '../../../service/bp-api-product/categorie-end-point/categorie-end-point.service';
import { MvtStockDto } from '../../../model/dto/mvtStockDto';
import { Exportproduit } from '../../../model/Exportproduit';
import { formatDate } from '@angular/common';

@Component({
  selector: 'ngx-gestion-produits-articles',
  templateUrl: './gestion-produits-articles.component.html',
  styleUrls: ['./gestion-produits-articles.component.scss']
})
export class GestionProduitsArticlesComponent implements OnInit {

  constructor(private _ProductEndPointService: ProductEndPointService, private router: Router,
    private _GlobalService: GlobalServiceService, private _ProduitProintVenteEndPointService: ProduitProintVenteEndPointService,
    private _PointVenteEndPointService: PointVenteEndPointService, private _MvtStockEndPointService: MvtStockEndPointService,
    private _DateService: DateService, private _CategorieEndPointService: CategorieEndPointService) { }
  articleTypes = [{ label: 'Stockable', value: 'stockable' }, { label: 'Consommable', value: 'consommable' }, { label: 'Service', value: 'service' }];
  operation = [{ label: 'entre', value: '+' }, { label: 'sortie ', value: '-' }];

  loading: boolean = true
  hide: boolean = true
  listproduit: VProduitProduitpointvente[] = []
  diplayproduit: boolean = false
  diplay: boolean = false
  pv: PointVente = new PointVente()
  cols2: any[]
  diplay2: boolean = false
  quantite: number
  sens: string;
  isStockCentral: boolean = false;
  affichefilter: boolean = false
  categories: Categorie[] = []
  listselectcateg: Categorie[] = []
  deprix: number
  aprix: number
  datecreation: Date
  notaffectedtocateg: boolean = false
  repturedestock: boolean = false
  presquerepturestock: boolean = false
  aveccodeinterne: boolean = false
  fannule: boolean = false
  listproduit2: any[] = []
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
  ngOnInit() {
    this.calendar = this.calendar_fr
    this.cols2 = [
      { field: 'Désignation', header: 'Désignation' },
      { field: 'Code', header: 'Code' },
      { field: 'Type', header: 'Type' },
      { field: 'DateCreation', header: 'DateCreation' },
      { field: 'DateCreation', header: 'DateCreation' },
      { field: 'DateCreation', header: 'DateCreation' },
      { field: 'Action', header: 'Action' },
    ];
    this.cols = [
      { field: 'Code', header: 'Code' },
      { field: 'Type', header: 'Type' }
    ]
    this._PointVenteEndPointService.findPointVenteByIdPointVente(localStorage.getItem("pointventeid")).subscribe(val => {
      this.pv = val.objectResponse;
      this.checkStockCentral();
    })
    this._ProduitProintVenteEndPointService.findAllProduitPointVenteByIdPointVente(localStorage.getItem("pointventeid")).subscribe(val => {
      console.log(val);

      if (val.result == 1) {
        this.loading = false
        this.listproduit = val.objectResponse
        if (this.isStockCentral) {
          this.listproduit = this.listproduit.filter(el => el.typeProduit == "stockable");
        }
        this.listproduit2 = []
        this.listproduit.forEach(el => {
          this.listproduit2.push(el)
        })
      } else {
        this.loading = false
        this.listproduit = []
      }
    }, err => {
      this.loading = false
      this.listproduit = []
    })
  }
  currentproduit: VProduitProduitpointvente = new VProduitProduitpointvente()
  mvtsotck: MvtStock = new MvtStock()
  prix(produit: VProduitProduitpointvente) {
    this.currentproduit = produit
    this.diplay = true
  }
  mvt(produit: VProduitProduitpointvente) {
    this.currentproduit = produit
    console.log(produit);

    this._MvtStockEndPointService.findTopByIdProduitProintVenteOrderByDateMvt(produit.produitpointvente.idproduitPointVente).subscribe(val => {
      if (val.result == 1) {
        this.mvtsotck = val.objectResponse
      }
      this.diplay2 = true
    })
  }

  checkStockCentral() {
    this.isStockCentral = this.pv.typePv == "centraleStock"
  }
  exportExcel() {

    let exportproduits: Exportproduit[] = []
    this.listproduit.forEach(el => {
      let exportproduit: Exportproduit = new Exportproduit()
      exportproduit.designation = el.designation
      exportproduit.code_a_Barre = el.codeBarre
      exportproduit.stockdepart = String(el.stockQteDepart)
      exportproduit.stockActuel = String(el.produitpointvente.stockReel)
      exportproduit.stockLimite = String(el.stockAlert)
      exportproduit.prix = String(el.prixTtc)
      exportproduit.tva = String(el.tva != null ? el.tva : '')
      exportproduits.push(exportproduit)
    })

    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(exportproduits);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "produits");
    });
  }
  saveAsExcelFile(buffer: any, fileName: string): void {
    import("file-saver").then(FileSaver => {
      let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      let EXCEL_EXTENSION = '.xlsx';
      const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
      });
      FileSaver.saveAs(data, fileName + '_export_' + formatDate(new Date(), 'dd_MM_yyyy_hh_mm', 'en-US') + EXCEL_EXTENSION);
    });
  }
  entregistre() {
    let mvtstockDto: MvtStockDto = new MvtStockDto()
    let mvtstock: MvtStock = new MvtStock()
    mvtstock.dateMvt = new Date()
    mvtstock.quantite = this.quantite
    mvtstock.sens = this.sens
    mvtstock.idProduitProintVente = this.currentproduit.produitpointvente.idproduitPointVente
    mvtstock.type = "correction Stock"
    console.log(mvtstock);
    mvtstockDto.mvtStock = mvtstock

    this._MvtStockEndPointService.CreateMvtStock(mvtstockDto).subscribe(val => {
      if (val.result == 1) {

        this._GlobalService.showToast('success', "success", "le mouvement de stock a été ajouté avec succès")
        this.listproduit.forEach(el => {
          if (el.idProduit == this.currentproduit.idProduit) {
            console.log(this.sens);
            console.log();

            if (this.sens == '+') {
              el.produitpointvente.stockReel = el.produitpointvente.stockReel + this.quantite
            } else {
              el.produitpointvente.stockReel = el.produitpointvente.stockReel - this.quantite
            }
          }
          this.diplay2 = false
        })
        this.sens = null
        this.quantite = null
      } else {
        this.diplay2 = false
        this._GlobalService.showToast('danger', "Erruer", val.errorDescription)
        this.sens = null
        this.quantite = null
      }
    }, erruer => {
      this._GlobalService.showToast('danger', "Erruer", erruer)
      this.diplay2 = false
      this.sens = null
      this.quantite = null
    })
  }
  newprix: number
  updatestock() {
    let produitpointvente: Produitpointvente = new Produitpointvente()

    produitpointvente = this.currentproduit.produitpointvente
    produitpointvente.prix = this.newprix
    console.log(produitpointvente);

    this._ProduitProintVenteEndPointService.updateProduitProintVente(produitpointvente).subscribe(val => {
      if (val.result == 1) {
        this.diplay = false
        this._GlobalService.showToast('success', "success", "le prix du produit a été modifier avec succès")
        this.listproduit.forEach(el => {
          if (el.produitpointvente.idproduitPointVente == this.currentproduit.produitpointvente.idproduitPointVente) {
            el.produitpointvente.prix = this.newprix
          }
        })
        this.newprix = null
      } else {
        this.diplay = false
        this._GlobalService.showToast('danger', "Erruer", val.errorDescription)
      }
    }, erruer => {
      this._GlobalService.showToast('danger', "Erruer", erruer)
      this.diplay = false
    })
  }

  annuler() {
    this.listproduit = []
    this.listproduit2.forEach(el => {
      this.listproduit.push(el)
    })
  }
  search() {
    this.annuler()
    console.log(this.listproduit);

    console.log(this.listselectcateg, this.deprix, this.aprix, this.datecreation, this.notaffectedtocateg, this.repturedestock, this.presquerepturestock, this.aveccodeinterne);
    this.fannule = true
    if (this.deprix != null) {
      if (this.aprix != null) {
        if (this.datecreation != null) {
          if (this.notaffectedtocateg) {
            if (this.repturedestock) {
              if (this.presquerepturestock) {
                if (this.aveccodeinterne) {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc > this.deprix && el.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.dateCreation) && el.stockReel == 0 && /* el.stockAlert>=el.stockReel && */ el.referenceInterne != null)

                } else {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc > this.deprix && el.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.dateCreation) && el.stockReel == 0 /* el.stockAlert>=el.stockReel && */)

                }
              } else {
                if (this.aveccodeinterne) {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc > this.deprix && el.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.dateCreation) && el.stockReel == 0 && el.referenceInterne != null)

                } else {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc > this.deprix && el.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.dateCreation) && el.stockReel == 0)

                }
              }
            } else {
              if (this.presquerepturestock) {
                if (this.aveccodeinterne) {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc > this.deprix && el.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.dateCreation) &&   /* el.stockAlert>=el.stockReel && */ el.referenceInterne != null)

                } else {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc > this.deprix && el.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.dateCreation)/* el.stockAlert>=el.stockReel && */)

                }
              } else {
                if (this.aveccodeinterne) {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc > this.deprix && el.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.dateCreation) && el.referenceInterne != null)

                } else {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc > this.deprix && el.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.dateCreation))

                }
              }
            }
          } else {
            if (this.repturedestock) {
              if (this.presquerepturestock) {
                if (this.aveccodeinterne) {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc > this.deprix && el.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.dateCreation) && el.stockReel == 0 && /* el.stockAlert>=el.stockReel && */ el.referenceInterne != null)

                } else {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc > this.deprix && el.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.dateCreation) && el.stockReel == 0 /* el.stockAlert>=el.stockReel && */)

                }
              } else {
                if (this.aveccodeinterne) {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc > this.deprix && el.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.dateCreation) && el.stockReel == 0 && el.referenceInterne != null)

                } else {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc > this.deprix && el.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.dateCreation) && el.stockReel == 0)

                }
              }
            } else {
              if (this.presquerepturestock) {
                if (this.aveccodeinterne) {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc > this.deprix && el.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.dateCreation) && /* el.stockAlert>=el.stockReel && */ el.referenceInterne != null)

                } else {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc > this.deprix && el.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.dateCreation) /* el.stockAlert>=el.stockReel && */)

                }
              } else {
                if (this.aveccodeinterne) {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc > this.deprix && el.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.dateCreation) && el.referenceInterne != null)

                } else {
                  console.log("date");

                  this.listproduit = this.listproduit.filter(el => el.prixTtc > this.deprix && el.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.dateCreation) /* el.stockAlert>=el.stockReel && */)
                }
              }
            }
          }
        } else {
          if (this.notaffectedtocateg) {
            if (this.repturedestock) {
              if (this.presquerepturestock) {
                if (this.aveccodeinterne) {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc > this.deprix && el.prixTtc < this.aprix && el.stockReel == 0 && /* el.stockAlert>=el.stockReel && */ el.referenceInterne != null)

                } else {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc > this.deprix && el.prixTtc < this.aprix && el.stockReel == 0 /* el.stockAlert>=el.stockReel && */)

                }
              } else {
                if (this.aveccodeinterne) {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc > this.deprix && el.prixTtc < this.aprix && el.stockReel == 0 && el.referenceInterne != null)

                } else {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc > this.deprix && el.prixTtc < this.aprix && el.stockReel == 0)

                }
              }
            } else {
              if (this.presquerepturestock) {
                if (this.aveccodeinterne) {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc > this.deprix && el.prixTtc < this.aprix && /* el.stockAlert>=el.stockReel && */ el.referenceInterne != null)

                } else {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc > this.deprix && el.prixTtc < this.aprix && el.stockReel == 0 && /* el.stockAlert>=el.stockReel && */ el.referenceInterne != null)

                }
              } else {
                if (this.aveccodeinterne) {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc > this.deprix && el.prixTtc < this.aprix && el.referenceInterne != null)

                } else {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc > this.deprix && el.prixTtc < this.aprix)

                }
              }
            }
          } else {
            if (this.repturedestock) {
              if (this.presquerepturestock) {
                if (this.aveccodeinterne) {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc > this.deprix && el.prixTtc < this.aprix && el.stockReel == 0 && /* el.stockAlert>=el.stockReel && */ el.referenceInterne != null)

                } else {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc > this.deprix && el.prixTtc < this.aprix && el.stockReel == 0 /* el.stockAlert>=el.stockReel && */)

                }
              } else {
                if (this.aveccodeinterne) {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc > this.deprix && el.prixTtc < this.aprix && el.stockReel == 0 && el.referenceInterne != null)

                } else {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc > this.deprix && el.prixTtc < this.aprix && el.stockReel == 0)

                }
              }
            } else {
              if (this.presquerepturestock) {
                if (this.aveccodeinterne) {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc > this.deprix && el.prixTtc < this.aprix && /* el.stockAlert>=el.stockReel && */ el.referenceInterne != null)

                } else {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc > this.deprix && el.prixTtc < this.aprix && el.stockReel == 0 && /* el.stockAlert>=el.stockReel && */ el.referenceInterne != null)

                }
              } else {
                if (this.aveccodeinterne) {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc > this.deprix && el.prixTtc < this.aprix && el.referenceInterne != null)

                } else {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc > this.deprix && el.prixTtc < this.aprix)

                }
              }
            }
          }
        }
      } else {
        if (this.datecreation != null) {
          if (this.notaffectedtocateg) {
            if (this.repturedestock) {
              if (this.presquerepturestock) {
                if (this.aveccodeinterne) {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc > this.deprix && this._DateService.checkdate(this.datecreation, el.dateCreation) && el.stockReel == 0 && /* el.stockAlert>=el.stockReel && */ el.referenceInterne != null)

                } else {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc > this.deprix && this._DateService.checkdate(this.datecreation, el.dateCreation) && el.stockReel == 0 /* el.stockAlert>=el.stockReel && */)

                }
              } else {
                if (this.aveccodeinterne) {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc > this.deprix && this._DateService.checkdate(this.datecreation, el.dateCreation) && el.stockReel == 0 && el.referenceInterne != null)

                } else {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc > this.deprix && this._DateService.checkdate(this.datecreation, el.dateCreation) && el.stockReel == 0)

                }
              }
            } else {
              if (this.presquerepturestock) {
                if (this.aveccodeinterne) {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc > this.deprix && this._DateService.checkdate(this.datecreation, el.dateCreation) &&   /* el.stockAlert>=el.stockReel && */ el.referenceInterne != null)

                } else {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc > this.deprix && this._DateService.checkdate(this.datecreation, el.dateCreation)/* el.stockAlert>=el.stockReel && */)

                }
              } else {
                if (this.aveccodeinterne) {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc > this.deprix && this._DateService.checkdate(this.datecreation, el.dateCreation) && el.referenceInterne != null)

                } else {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc > this.deprix && this._DateService.checkdate(this.datecreation, el.dateCreation))

                }
              }
            }
          } else {
            if (this.repturedestock) {
              if (this.presquerepturestock) {
                if (this.aveccodeinterne) {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc > this.deprix && this._DateService.checkdate(this.datecreation, el.dateCreation) && el.stockReel == 0 && /* el.stockAlert>=el.stockReel && */ el.referenceInterne != null)

                } else {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc > this.deprix && this._DateService.checkdate(this.datecreation, el.dateCreation) && el.stockReel == 0 /* el.stockAlert>=el.stockReel && */)

                }
              } else {
                if (this.aveccodeinterne) {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc > this.deprix && this._DateService.checkdate(this.datecreation, el.dateCreation) && el.stockReel == 0 && el.referenceInterne != null)

                } else {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc > this.deprix && this._DateService.checkdate(this.datecreation, el.dateCreation) && el.stockReel == 0)

                }
              }
            } else {
              if (this.presquerepturestock) {
                if (this.aveccodeinterne) {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc > this.deprix && this._DateService.checkdate(this.datecreation, el.dateCreation) && /* el.stockAlert>=el.stockReel && */ el.referenceInterne != null)

                } else {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc > this.deprix && this._DateService.checkdate(this.datecreation, el.dateCreation) /* el.stockAlert>=el.stockReel && */)

                }
              } else {
                if (this.aveccodeinterne) {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc > this.deprix && this._DateService.checkdate(this.datecreation, el.dateCreation) && el.referenceInterne != null)

                } else {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc > this.deprix && this._DateService.checkdate(this.datecreation, el.dateCreation) /* el.stockAlert>=el.stockReel && */)
                }
              }
            }
          }
        } else {
          if (this.notaffectedtocateg) {
            if (this.repturedestock) {
              if (this.presquerepturestock) {
                if (this.aveccodeinterne) {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc > this.deprix && el.stockReel == 0 && /* el.stockAlert>=el.stockReel && */ el.referenceInterne != null)

                } else {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc > this.deprix && el.stockReel == 0 /* el.stockAlert>=el.stockReel && */)

                }
              } else {
                if (this.aveccodeinterne) {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc > this.deprix && el.stockReel == 0 && el.referenceInterne != null)

                } else {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc > this.deprix && el.stockReel == 0)

                }
              }
            } else {
              if (this.presquerepturestock) {
                if (this.aveccodeinterne) {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc > this.deprix && /* el.stockAlert>=el.stockReel && */ el.referenceInterne != null)

                } else {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc > this.deprix && el.stockReel == 0 && /* el.stockAlert>=el.stockReel && */ el.referenceInterne != null)

                }
              } else {
                if (this.aveccodeinterne) {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc > this.deprix && el.referenceInterne != null)

                } else {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc > this.deprix)

                }
              }
            }
          } else {
            if (this.repturedestock) {
              if (this.presquerepturestock) {
                if (this.aveccodeinterne) {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc > this.deprix && el.stockReel == 0 && /* el.stockAlert>=el.stockReel && */ el.referenceInterne != null)

                } else {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc > this.deprix && el.stockReel == 0 /* el.stockAlert>=el.stockReel && */)

                }
              } else {
                if (this.aveccodeinterne) {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc > this.deprix && el.stockReel == 0 && el.referenceInterne != null)

                } else {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc > this.deprix && el.stockReel == 0)

                }
              }
            } else {
              if (this.presquerepturestock) {
                if (this.aveccodeinterne) {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc > this.deprix && /* el.stockAlert>=el.stockReel && */ el.referenceInterne != null)

                } else {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc > this.deprix && el.stockReel == 0 && /* el.stockAlert>=el.stockReel && */ el.referenceInterne != null)

                }
              } else {
                if (this.aveccodeinterne) {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc > this.deprix && el.referenceInterne != null)

                } else {
                  console.log('6666666666666666666666');

                  this.listproduit = this.listproduit.filter(el => el.prixTtc > this.deprix)

                }
              }
            }
          }
        }
      }
    } else {
      if (this.aprix != null) {
        if (this.datecreation != null) {
          if (this.notaffectedtocateg) {
            if (this.repturedestock) {
              if (this.presquerepturestock) {
                if (this.aveccodeinterne) {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.dateCreation) && el.stockReel == 0 && /* el.stockAlert>=el.stockReel && */ el.referenceInterne != null)

                } else {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.dateCreation) && el.stockReel == 0 /* el.stockAlert>=el.stockReel && */)

                }
              } else {
                if (this.aveccodeinterne) {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.dateCreation) && el.stockReel == 0 && el.referenceInterne != null)

                } else {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.dateCreation) && el.stockReel == 0)

                }
              }
            } else {
              if (this.presquerepturestock) {
                if (this.aveccodeinterne) {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.dateCreation) &&   /* el.stockAlert>=el.stockReel && */ el.referenceInterne != null)

                } else {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.dateCreation)/* el.stockAlert>=el.stockReel && */)

                }
              } else {
                if (this.aveccodeinterne) {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.dateCreation) && el.referenceInterne != null)

                } else {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.dateCreation))

                }
              }
            }
          } else {
            if (this.repturedestock) {
              if (this.presquerepturestock) {
                if (this.aveccodeinterne) {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.dateCreation) && el.stockReel == 0 && /* el.stockAlert>=el.stockReel && */ el.referenceInterne != null)

                } else {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.dateCreation) && el.stockReel == 0 /* el.stockAlert>=el.stockReel && */)

                }
              } else {
                if (this.aveccodeinterne) {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.dateCreation) && el.stockReel == 0 && el.referenceInterne != null)

                } else {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.dateCreation) && el.stockReel == 0)

                }
              }
            } else {
              if (this.presquerepturestock) {
                if (this.aveccodeinterne) {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.dateCreation) && /* el.stockAlert>=el.stockReel && */ el.referenceInterne != null)

                } else {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.dateCreation) /* el.stockAlert>=el.stockReel && */)

                }
              } else {
                if (this.aveccodeinterne) {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.dateCreation) && el.referenceInterne != null)

                } else {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.dateCreation) /* el.stockAlert>=el.stockReel && */)
                }
              }
            }
          }
        } else {
          if (this.notaffectedtocateg) {
            if (this.repturedestock) {
              if (this.presquerepturestock) {
                if (this.aveccodeinterne) {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc < this.aprix && el.stockReel == 0 && /* el.stockAlert>=el.stockReel && */ el.referenceInterne != null)

                } else {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc < this.aprix && el.stockReel == 0 /* el.stockAlert>=el.stockReel && */)

                }
              } else {
                if (this.aveccodeinterne) {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc < this.aprix && el.stockReel == 0 && el.referenceInterne != null)

                } else {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc < this.aprix && el.stockReel == 0)

                }
              }
            } else {
              if (this.presquerepturestock) {
                if (this.aveccodeinterne) {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc < this.aprix && /* el.stockAlert>=el.stockReel && */ el.referenceInterne != null)

                } else {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc < this.aprix && el.stockReel == 0 && /* el.stockAlert>=el.stockReel && */ el.referenceInterne != null)

                }
              } else {
                if (this.aveccodeinterne) {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc < this.aprix && el.referenceInterne != null)

                } else {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc < this.aprix)

                }
              }
            }
          } else {
            if (this.repturedestock) {
              if (this.presquerepturestock) {
                if (this.aveccodeinterne) {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc < this.aprix && el.stockReel == 0 && /* el.stockAlert>=el.stockReel && */ el.referenceInterne != null)

                } else {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc < this.aprix && el.stockReel == 0 /* el.stockAlert>=el.stockReel && */)

                }
              } else {
                if (this.aveccodeinterne) {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc < this.aprix && el.stockReel == 0 && el.referenceInterne != null)

                } else {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc < this.aprix && el.stockReel == 0)

                }
              }
            } else {
              if (this.presquerepturestock) {
                if (this.aveccodeinterne) {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc < this.aprix && /* el.stockAlert>=el.stockReel && */ el.referenceInterne != null)

                } else {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc < this.aprix && el.stockReel == 0 && /* el.stockAlert>=el.stockReel && */ el.referenceInterne != null)

                }
              } else {
                if (this.aveccodeinterne) {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc < this.aprix && el.referenceInterne != null)

                } else {
                  console.log("eeeee");

                  this.listproduit = this.listproduit.filter(el => el.prixTtc < this.aprix)

                }
              }
            }
          }
        }
      } else {
        if (this.datecreation != null) {
          if (this.notaffectedtocateg) {
            if (this.repturedestock) {
              if (this.presquerepturestock) {
                if (this.aveccodeinterne) {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.dateCreation) && el.stockReel == 0 && /* el.stockAlert>=el.stockReel && */ el.referenceInterne != null)

                } else {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.dateCreation) && el.stockReel == 0 /* el.stockAlert>=el.stockReel && */)

                }
              } else {
                if (this.aveccodeinterne) {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.dateCreation) && el.stockReel == 0 && el.referenceInterne != null)

                } else {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.dateCreation) && el.stockReel == 0)

                }
              }
            } else {
              if (this.presquerepturestock) {
                if (this.aveccodeinterne) {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.dateCreation) &&   /* el.stockAlert>=el.stockReel && */ el.referenceInterne != null)

                } else {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.dateCreation)/* el.stockAlert>=el.stockReel && */)

                }
              } else {
                if (this.aveccodeinterne) {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.dateCreation) && el.referenceInterne != null)

                } else {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.dateCreation))

                }
              }
            }
          } else {
            if (this.repturedestock) {
              if (this.presquerepturestock) {
                if (this.aveccodeinterne) {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.dateCreation) && el.stockReel == 0 && /* el.stockAlert>=el.stockReel && */ el.referenceInterne != null)

                } else {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.dateCreation) && el.stockReel == 0 /* el.stockAlert>=el.stockReel && */)

                }
              } else {
                if (this.aveccodeinterne) {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.dateCreation) && el.stockReel == 0 && el.referenceInterne != null)

                } else {
                  this.listproduit = this.listproduit.filter(el => el.prixTtc < this.aprix && this._DateService.checkdate(this.datecreation, el.dateCreation) && el.stockReel == 0)

                }
              }
            } else {
              if (this.presquerepturestock) {
                if (this.aveccodeinterne) {
                  this.listproduit = this.listproduit.filter(el => this._DateService.checkdate(this.datecreation, el.dateCreation) && /* el.stockAlert>=el.stockReel && */ el.referenceInterne != null)

                } else {
                  this.listproduit = this.listproduit.filter(el => this._DateService.checkdate(this.datecreation, el.dateCreation) /* el.stockAlert>=el.stockReel && */)

                }
              } else {
                if (this.aveccodeinterne) {
                  this.listproduit = this.listproduit.filter(el => this._DateService.checkdate(this.datecreation, el.dateCreation) && el.referenceInterne != null)

                } else {

                  this.listproduit = this.listproduit.filter(el => this._DateService.checkdate(this.datecreation, el.dateCreation) /* el.stockAlert>=el.stockReel && */)
                }
              }
            }
          }
        } else {
          if (this.notaffectedtocateg) {
            if (this.repturedestock) {
              if (this.presquerepturestock) {
                if (this.aveccodeinterne) {
                  this.listproduit = this.listproduit.filter(el => el.stockReel == 0 && /* el.stockAlert>=el.stockReel && */ el.referenceInterne != null)

                } else {
                  this.listproduit = this.listproduit.filter(el => el.stockReel == 0 /* el.stockAlert>=el.stockReel && */)

                }
              } else {
                if (this.aveccodeinterne) {
                  this.listproduit = this.listproduit.filter(el => el.stockReel == 0 && el.referenceInterne != null)

                } else {
                  this.listproduit = this.listproduit.filter(el => el.stockReel == 0)

                }
              }
            } else {
              if (this.presquerepturestock) {
                if (this.aveccodeinterne) {
                  this.listproduit = this.listproduit.filter(el => /* el.stockAlert>=el.stockReel && */ el.referenceInterne != null)

                } else {
                  this.listproduit = this.listproduit.filter(el => el.stockReel == 0 && /* el.stockAlert>=el.stockReel && */ el.referenceInterne != null)

                }
              } else {
                if (this.aveccodeinterne) {
                  this.listproduit = this.listproduit.filter(el => el.referenceInterne != null)

                } else {
                  this.listproduit = this.listproduit.filter(el => true)

                }
              }
            }
          } else {
            if (this.repturedestock) {
              if (this.presquerepturestock) {
                if (this.aveccodeinterne) {
                  this.listproduit = this.listproduit.filter(el => el.stockReel == 0 && /* el.stockAlert>=el.stockReel && */ el.referenceInterne != null)

                } else {
                  this.listproduit = this.listproduit.filter(el => el.stockReel == 0 /* el.stockAlert>=el.stockReel && */)

                }
              } else {
                if (this.aveccodeinterne) {
                  this.listproduit = this.listproduit.filter(el => el.stockReel == 0 && el.referenceInterne != null)

                } else {
                  this.listproduit = this.listproduit.filter(el => el.stockReel == 0)

                }
              }
            } else {
              if (this.presquerepturestock) {
                if (this.aveccodeinterne) {
                  this.listproduit = this.listproduit.filter(el => /* el.stockAlert>=el.stockReel && */ el.referenceInterne != null)

                } else {
                  this.listproduit = this.listproduit.filter(el => el.stockReel == 0 && /* el.stockAlert>=el.stockReel && */ el.referenceInterne != null)

                }
              } else {
                if (this.aveccodeinterne) {
                  this.listproduit = this.listproduit.filter(el => el.referenceInterne != null)

                } else {
                  this.listproduit = this.listproduit.filter(el => true)

                }
              }
            }
          }
        }
      }
    }


  }
  loading2: boolean = false
  listcategories: any[] = []
  diplay3: boolean = false
  cols: any[]
  getlistcategorie(id: string) {
    this.diplay3 = true
    this.loading2 = true
    this.listcategories = []
    console.log(id);
    this._CategorieEndPointService.findAllCategoriesbyidproduit(id, localStorage.getItem("pointventeid")).subscribe(val => {
      console.log(val);

      if (val.objectResponse != null) {
        this.listcategories = val.objectResponse
      } else {
        this.listcategories = []
      }
      this.loading2 = false
    })
  }
}
