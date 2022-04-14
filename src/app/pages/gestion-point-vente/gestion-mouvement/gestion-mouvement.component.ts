import { Component, OnInit, ViewChild } from '@angular/core';
import { MvtStockEndPointService } from '../../../service/bp-api-product/mvt-stock-end-point/mvt-stock-end-point.service';
import { Router } from '@angular/router';
import { MvtStock } from '../../../model/MvtStock';
import { MvtStockProduit } from '../../../model/MvtStockProduit';
import { ProduitProintVenteEndPointService } from '../../../service/bp-api-product/produit-proint-vente-end-point/produit-proint-vente-end-point.service';
import { DateService } from '../../../service/GlobalService/DateSevice/date.service';
import { MvtDto } from '../../../model/dto/MvtDto';
import { FournisseurEndPointService } from '../../../service/bp-api-product/fournisseur-end-point/fournisseur-end-point.service';
import { PointVenteEndPointService } from '../../../service/bp-api-pos/point-vente-end-point/point-vente-end-point.service';
import { PointVente } from '../../../model/PointVente';
import autoTable, { applyPlugin, __createTable } from 'jspdf-autotable'
import { NbTabComponent, NbTabsetComponent } from '@nebular/theme';
import { BonCommandeService } from '../../../service/bp-api-product/bon-commande/bon-commande.service';
import { BonCommande } from '../../../model/BonCommande';
import { PartenaireBpriceEndPointService } from '../../../service/bp-api-pos/partenaire-bprice-end-point/partenaire-bprice-end-point.service';
import { PartenaireBprice } from '../../../model/PartenaireBprice';
import { MvtStockProduct } from '../../../model/MvtStockProduct';
@Component({
  selector: 'ngx-gestion-mouvement',
  templateUrl: './gestion-mouvement.component.html',
  styleUrls: ['./gestion-mouvement.component.scss']
})
export class GestionMouvementComponent implements OnInit {


  constructor(private _MvtStockEndPointService: MvtStockEndPointService, private router: Router,
    private _ProduitProintVenteEndPointService: ProduitProintVenteEndPointService,
    private _DateService: DateService, private _FournisseurEndPointService: FournisseurEndPointService,
    private pointVenteEndPointService: PointVenteEndPointService,
    private bonCommandeService: BonCommandeService,
    private partenaireBpriceEndPointService: PartenaireBpriceEndPointService) { }
  operation = [{ label: 'entre', value: '+' }, { label: 'sortie ', value: '-' }];

  loading: boolean = true
  sortOptions: any[];
  sens: string
  sortKey: string;

  sortField: string;

  sortOrder: number;
  prodcuts: any[]
  affichefilter: boolean = true;
  listselectcateg: any[] = []
  selectedPv: PointVente = null;
  dequantite: number
  aquantite: number
  datecreation: Date
  datefincreation: Date
  fannule: boolean = false
  public calendar: any;
  selectedMvts: any[] = []
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
  mvtmoin: any[] = []
  mvtmoin2: any[] = []
  nbrplus: boolean = true
  listfourni: any[] = [];
  pointVentes: PointVente[] = [];
  canCheak: boolean = false;
  @ViewChild("tabset", { static: false }) tabsetEl: NbTabsetComponent;
  @ViewChild("mvtSortant", { static: false }) mvtSortant: NbTabComponent;


  ngOnInit() {
    this.calendar = this.calendar_fr
    this.cols = [
      { field: 'Produit', header: 'Produit' },
      { field: 'produit.stockQteDepart', header: 'Stock Reapp' },
      { field: 'produit.stockAlert', header: 'Stock Alert' },
      { field: 'Stock Reel', header: 'Disponible' },
      { field: 'Operation', header: 'Opération' },
      { field: 'Quantité', header: 'Quantité' },
      { field: 'type', header: 'Type' },
      { field: 'Date Operation', header: 'Date Opération' }

    ];
    // this._FournisseurEndPointService.findAllByIdPatenaireBprice(localStorage.getItem("partenaireid")).subscribe(val=>{
    //   this.listfourni=val.objectResponse!=null?val.objectResponse:[]
    // })
    this.getPartenaireById();
    this.getAllPointVente();
    this._ProduitProintVenteEndPointService.findAllProduitPointVenteByIdPointVente(localStorage.getItem("pointventeid")).subscribe(val => {
      this.prodcuts = val.objectResponse
      this._MvtStockEndPointService.findAllMctByIdPointVente(localStorage.getItem("pointventeid")).subscribe(pv => {
        this.loading = false
        if (pv.result == 1) {
          this.mvts = pv.objectResponse
          this.mvts = this.mvts.filter(el => {
            let mvtlength: number = el.mvts.length
            el.mvts = el.mvts.filter(val => val.sens == "+")
            if (mvtlength == el.mvts.length || mvtlength != 0) {
              if (el.mvts.length != 0) {
                return true
              }
              return false
            } else {
              return false
            }
          })

          this.mvts2 = []
          this.mvts.forEach(el => {
            let mvt: MvtDto = new MvtDto()
            mvt.idPointVente = el != null ? el.idPointVente : '';
            mvt.idProduit = el != null ? el.idProduit : '';
            mvt.stockReel = el != null ? el.stockReel : '';
            mvt.produit = el != null ? el.produit : '';
            mvt.mvts = []
            el.mvts.forEach(element => {
              mvt.mvts.push(element)
            });
            this.mvts2.push(mvt)
          })
        } else {
          this.mvts = []
          this.mvts2 = []
        }
      }, errer => {
        this.loading = false
        this.mvts = []
        this.mvts2 = []
      })

      this._MvtStockEndPointService.findAllMctByIdPointVente(localStorage.getItem("pointventeid")).subscribe(pv => {
        this.loading = false
        if (pv.result == 1) {
          this.mvtmoin = pv.objectResponse
          console.log(this.mvtmoin);

          this.mvtmoin = this.mvtmoin.filter(el => {
            let mvtlength: number = el.mvts.length
            el.mvts = el.mvts.filter(val => val.sens == "-")
            // el.mvts=el.mvtEntrant
            if (mvtlength == el.mvts.length || mvtlength != 0) {
              if (el.mvts.length != 0) {
                return true
              }
              return false
            } else {
              return false
            }
          })
          this.mvtmoin2 = []
          this.mvtmoin.forEach(el => {
            let mvt: MvtDto = new MvtDto()
            mvt.idPointVente = el != null ? el.idPointVente : ''
            mvt.idProduit = el != null ? el.idProduit : ''
            mvt.stockReel = el != null ? el.stockReel : ''
            mvt.produit = el != null ? el.produit : '';
            mvt.mvts = []
            el.mvts.forEach(element => {
              mvt.mvts.push(element)
            });
            this.mvtmoin2.push(mvt)
          })
        } else {
          this.mvtmoin = []
          this.mvtmoin2 = []
        }
      }, errer => {
        this.loading = false
        this.mvtmoin = []
        this.mvtmoin2 = []
      })
    })

  }

  getAllPointVente() {
    this.pointVenteEndPointService.findAllByIdPartenaireBprice(localStorage.getItem("partenaireid")).subscribe(val => {
      this.pointVentes = val.objectResponse != null ? val.objectResponse.filter(el => el.idPointVente != localStorage.getItem("pointventeid")) : [];
    })
  }
  partenaire: PartenaireBprice;
  getPartenaireById() {
    this.partenaireBpriceEndPointService.findByIdPartenaire(localStorage.getItem("partenaireid")).subscribe(val => {
      this.partenaire = val.objectResponse;
    })
  }
  getname(id) {
    if (this.prodcuts != null && this.prodcuts.length > 0)
      return this.prodcuts.filter(el => el.idProduit == id)[0].designation
  }
  // getnameF(id){
  //   if( this.listfourni!=null &&  this.listfourni.length>0)
  //   return this.listfourni.filter(el=>el.id==id)[0].designation
  // } 
  mvts: MvtDto[] = []
  mvts2: MvtDto[] = []

  getentrant() {
    let newmvts: any[] = []
    this.mvts.forEach(el => {
      newmvts.push(el)
    })
    // if(this.mvts!=null){
    //   return newmvts.filter(el=>{
    //     let mvtlength:number=el.mvts.length
    //     let subnewmvts:any[]=[]
    //     mvt.idPointVente=el!=null?el.idPointVente:''
    //       mvt.idProduit=el!=null?el.idProduit:''
    //       mvt.stockReel=el!=null?el.stockReel:''
    //       mvt.mvts=[]
    //     el.mvts.filter(val=>val.sens=="+").forEach(element => {
    //       subnewmvts.push(element)

    //       let mvt:MvtDto=new MvtDto()
    //       console.log(el);


    //       el.mvts.forEach(element => {
    //         mvt.mvts.push(element)
    //       });
    //       this.mvts2.push(mvt)


    //     });
    //     el.mvts=subnewmvts
    //     if(mvtlength==el.mvts.length || mvtlength!=0 ){
    //       if(el.mvts.length!=0){
    //         return true
    //       }
    //       return false
    //     }else{
    //       return false
    //     }
    //   } )
    // }else{
    //   return []
    // }


  }
  getsortie() {
    if (this.mvts != null) {
      return this.mvts.filter(el => {
        let mvtlength: number = el.mvts.length
        el.mvts = el.mvts.filter(val => val.sens == "-")
        if (mvtlength == el.mvts.length || mvtlength != 0) {
          if (el.mvts.length != 0) {
            return true
          }
          return false
        } else {
          return false
        }
      })
    } else {
      return []
    }
    return []
  }
  cols: any[];

  redirect() {
    this.router.navigateByUrl("/pages/Pointvente/gestionMouvement/NouveauMouvement")
  }
  onChangeTab(event) {
    if (event.tabTitle == "mouvement sortant  ") {
      this.nbrplus = false
    } else {
      this.nbrplus = true
    }

  }
  customSort(event) {
    if (event.field == "Produit") {
      if (event.order == 1) {
        event.data.sort((data1, data2) => {
          return this.prodcuts.filter(el => el.idProduit == data1.idProduit)[0].designation.localeCompare(this.prodcuts.filter(el => el.idProduit == data2.idProduit)[0].designation)
        });
      } else {
        event.data.sort((data1, data2) => {
          return this.prodcuts.filter(el => el.idProduit == data2.idProduit)[0].designation.localeCompare(this.prodcuts.filter(el => el.idProduit == data1.idProduit)[0].designation)
        });
      }

    } else if (event.field == "Stock Reel") {
      if (event.order == 1) {
        event.data.sort((data1, data2) => {
          return data1.stockReel - data2.stockReel
        });
      } else {
        event.data.sort((data1, data2) => {
          return data2.stockReel - data1.stockReel
        });
      }
    } else if (event.field == "Operation") {
      event.data.forEach(element => {
        if (event.order == 1) {
          element.mvts.sort((data1, data2) => {
            return data1.sens.localeCompare(data2.sens)
          });
        } else {
          element.mvts.sort((data1, data2) => {
            return data2.sens.localeCompare(data1.sens)
          });
        }
      });

    } else if (event.field == "Quantité") {
      event.data.forEach(element => {
        if (event.order == 1) {
          element.mvts.sort((data1, data2) => {
            return data1.quantite - data2.quantite
          });
        } else {
          element.mvts.sort((data1, data2) => {
            return data2.quantite - data1.quantite
          });
        }
      });

    } else if (event.field == "Date Operation") {
      event.data.forEach(element => {
        if (event.order == 1) {
          element.mvts.sort((data1, data2) => {
            return new Date(data2.dateMvt).getTime() - new Date(data1.dateMvt).getTime()
          });
        } else {
          element.mvts.sort((data1, data2) => {
            return new Date(data1.dateMvt).getTime() - new Date(data2.dateMvt).getTime()
          });
        }
      });

    } else if (event.field == "type") {
      event.data.forEach(element => {
        if (event.order == 1) {
          element.mvts.sort((data1, data2) => {
            if (data1.type == null) {
              data1.type = ""
            }
            if (data2.type == null) {
              data2.type = ""
            }
            return data1.type.localeCompare(data2.type)
          });
        } else {
          element.mvts.sort((data1, data2) => {
            if (data1.type == null) {
              data1.type = ""
            }
            if (data2.type == null) {
              data2.type = ""
            }
            return data2.type.localeCompare(data1.type)
          });
        }
      });

    }
  }

  annuler() {
    this.selectedMvts = [];
    this.canCheak = false;
    this.mvts = []
    this.mvts2.forEach(el => {
      let mvt: MvtDto = new MvtDto()
      mvt.idPointVente = el != null ? el.idPointVente : ''
      mvt.idProduit = el != null ? el.idProduit : ''
      mvt.stockReel = el != null ? el.stockReel : ''
      mvt.produit = el != null ? el.produit : '';
      mvt.mvts = []
      el.mvts.forEach(element => {
        mvt.mvts.push(element)
      });
      this.mvts.push(mvt)
    })

    this.mvtmoin = []
    this.mvtmoin2.forEach(el => {
      let mvt: MvtDto = new MvtDto()
      mvt.idPointVente = el != null ? el.idPointVente : ''
      mvt.idProduit = el != null ? el.idProduit : ''
      mvt.stockReel = el != null ? el.stockReel : ''
      mvt.produit = el != null ? el.produit : '';
      mvt.mvts = []
      el.mvts.forEach(element => {
        mvt.mvts.push(element)
      });
      this.mvtmoin.push(mvt)
    })
  }
  search() {
    this.annuler()
    this.fannule = true

    if (this.datefincreation == null) {
      if (this.sens == null) {
        if (this.listselectcateg != null && this.listselectcateg.length > 0) {
          if (this.dequantite != null) {
            if (this.aquantite != null) {
              if (this.datecreation != null) {
                this.mvts = this.mvts.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.quantite >= this.dequantite && val.quantite <= this.aquantite && this._DateService.checkdate(this.datecreation, val.dateMvt))
                  if ((mvtlength == el.mvts.length || mvtlength != 0) && this.listselectcateg.filter(vall => vall.idProduit == el.idProduit).length > 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })

                this.mvtmoin = this.mvtmoin.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.quantite >= this.dequantite && val.quantite <= this.aquantite && this._DateService.checkdate(this.datecreation, val.dateMvt))
                  if ((mvtlength == el.mvts.length || mvtlength != 0) && this.listselectcateg.filter(vall => vall.idProduit == el.idProduit).length > 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })
              } else {
                this.mvts = this.mvts.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.quantite >= this.dequantite && val.quantite <= this.aquantite)
                  if ((mvtlength == el.mvts.length || mvtlength != 0) && this.listselectcateg.filter(vall => vall.idProduit == el.idProduit).length > 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })

                this.mvtmoin = this.mvtmoin.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.quantite >= this.dequantite && val.quantite <= this.aquantite)
                  if ((mvtlength == el.mvts.length || mvtlength != 0) && this.listselectcateg.filter(vall => vall.idProduit == el.idProduit).length > 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })
              }
            } else {
              if (this.datecreation != null) {
                this.mvts = this.mvts.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.quantite >= this.dequantite && this._DateService.checkdate(this.datecreation, val.dateMvt))
                  if ((mvtlength == el.mvts.length || mvtlength != 0) && this.listselectcateg.filter(vall => vall.idProduit == el.idProduit).length > 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })

                this.mvtmoin = this.mvtmoin.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.quantite >= this.dequantite && this._DateService.checkdate(this.datecreation, val.dateMvt))
                  if ((mvtlength == el.mvts.length || mvtlength != 0) && this.listselectcateg.filter(vall => vall.idProduit == el.idProduit).length > 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })
              } else {
                this.mvts = this.mvts.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.quantite >= this.dequantite && val.quantite <= this.aquantite)
                  if ((mvtlength == el.mvts.length || mvtlength != 0) && this.listselectcateg.filter(vall => vall.idProduit == el.idProduit).length > 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })

                this.mvtmoin = this.mvtmoin.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.quantite >= this.dequantite && val.quantite <= this.aquantite)
                  if ((mvtlength == el.mvts.length || mvtlength != 0) && this.listselectcateg.filter(vall => vall.idProduit == el.idProduit).length > 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })
              }
            }
          } else {
            if (this.aquantite != null) {
              if (this.datecreation != null) {
                this.mvts = this.mvts.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.quantite <= this.aquantite && this._DateService.checkdate(this.datecreation, val.dateMvt))
                  if ((mvtlength == el.mvts.length || mvtlength != 0) && this.listselectcateg.filter(vall => vall.idProduit == el.idProduit).length > 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })

                this.mvtmoin = this.mvtmoin.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.quantite <= this.aquantite && this._DateService.checkdate(this.datecreation, val.dateMvt))
                  if ((mvtlength == el.mvts.length || mvtlength != 0) && this.listselectcateg.filter(vall => vall.idProduit == el.idProduit).length > 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })
              } else {
                this.mvts = this.mvts.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.quantite <= this.aquantite)
                  if ((mvtlength == el.mvts.length || mvtlength != 0) && this.listselectcateg.filter(vall => vall.idProduit == el.idProduit).length > 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })

                this.mvtmoin = this.mvtmoin.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.quantite <= this.aquantite)
                  if ((mvtlength == el.mvts.length || mvtlength != 0) && this.listselectcateg.filter(vall => vall.idProduit == el.idProduit).length > 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })
              }
            } else {
              if (this.datecreation != null) {
                this.mvts = this.mvts.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => this._DateService.checkdate(this.datecreation, val.dateMvt))
                  if ((mvtlength == el.mvts.length || mvtlength != 0) && this.listselectcateg.filter(vall => vall.idProduit == el.idProduit).length > 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })

                this.mvtmoin = this.mvtmoin.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => this._DateService.checkdate(this.datecreation, val.dateMvt))
                  if ((mvtlength == el.mvts.length || mvtlength != 0) && this.listselectcateg.filter(vall => vall.idProduit == el.idProduit).length > 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })
              } else {
                this.mvts = this.mvts.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => true)
                  if ((mvtlength == el.mvts.length || mvtlength != 0) && this.listselectcateg.filter(vall => vall.idProduit == el.idProduit).length > 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })

                this.mvtmoin = this.mvtmoin.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => true)
                  if ((mvtlength == el.mvts.length || mvtlength != 0) && this.listselectcateg.filter(vall => vall.idProduit == el.idProduit).length > 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })
              }
            }
          }
        } else {
          if (this.dequantite != null) {
            if (this.aquantite != null) {
              if (this.datecreation != null) {
                this.mvts = this.mvts.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.quantite >= this.dequantite && val.quantite <= this.aquantite && this._DateService.checkdate(this.datecreation, val.dateMvt))
                  if (mvtlength == el.mvts.length || mvtlength != 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })

                this.mvtmoin = this.mvtmoin.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.quantite >= this.dequantite && val.quantite <= this.aquantite && this._DateService.checkdate(this.datecreation, val.dateMvt))
                  if (mvtlength == el.mvts.length || mvtlength != 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })
              } else {
                this.mvts = this.mvts.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.quantite >= this.dequantite && val.quantite <= this.aquantite)
                  if (mvtlength == el.mvts.length || mvtlength != 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })

                this.mvtmoin = this.mvtmoin.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.quantite >= this.dequantite && val.quantite <= this.aquantite)
                  if (mvtlength == el.mvts.length || mvtlength != 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })
                // this.mvts=this.mvts.filter(el=> el.prixPack>=this.dequantite && el.prixPack<=this.aquantite )          
              }
            } else {
              if (this.datecreation != null) {
                // this.mvts=this.mvts.filter(el=> el.prixPack>=this.dequantite && this._DateService.checkdate(this.datecreation,el.dateCreation) )          
                this.mvts = this.mvts.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.quantite >= this.dequantite && this._DateService.checkdate(this.datecreation, val.dateMvt))
                  if (mvtlength == el.mvts.length || mvtlength != 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })

                this.mvtmoin = this.mvtmoin.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.quantite >= this.dequantite && this._DateService.checkdate(this.datecreation, val.dateMvt))
                  if (mvtlength == el.mvts.length || mvtlength != 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })
              } else {
                this.mvts = this.mvts.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.quantite >= this.dequantite)
                  if (mvtlength == el.mvts.length || mvtlength != 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })

                this.mvtmoin = this.mvtmoin.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.quantite >= this.dequantite)
                  if (mvtlength == el.mvts.length || mvtlength != 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })
                // this.mvts=this.mvts.filter(el=> el.prixPack>=this.dequantite )          
              }
            }
          } else {
            if (this.aquantite != null) {
              if (this.datecreation != null) {
                // this.mvts=this.mvts.filter(el=>  el.prixPack<=this.aquantite && this._DateService.checkdate(this.datecreation,el.dateCreation) )          
                this.mvts = this.mvts.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.quantite <= this.aquantite && this._DateService.checkdate(this.datecreation, val.dateMvt))
                  if (mvtlength == el.mvts.length || mvtlength != 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })

                this.mvtmoin = this.mvtmoin.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.quantite <= this.aquantite && this._DateService.checkdate(this.datecreation, val.dateMvt))
                  if (mvtlength == el.mvts.length || mvtlength != 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })
              } else {
                // this.mvts=this.mvts.filter(el=>  el.prixPack<=this.aquantite )   
                this.mvts = this.mvts.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.quantite <= this.aquantite)
                  if (mvtlength == el.mvts.length || mvtlength != 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })

                this.mvtmoin = this.mvtmoin.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.quantite <= this.aquantite)
                  if (mvtlength == el.mvts.length || mvtlength != 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })
              }
            } else {
              if (this.datecreation != null) {
                this.mvts = this.mvts.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => this._DateService.checkdate(this.datecreation, val.dateMvt))
                  if (mvtlength == el.mvts.length || mvtlength != 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })

                this.mvtmoin = this.mvtmoin.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => this._DateService.checkdate(this.datecreation, val.dateMvt))
                  if (mvtlength == el.mvts.length || mvtlength != 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })
                // this.mvts=this.mvts.filter(el=> this._DateService.checkdate(this.datecreation,el.dateCreation) )          
              } else {
                // this.mvts=this.mvts.filter(el=>true)  
                this.mvts = this.mvts.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => true)
                  if (mvtlength == el.mvts.length || mvtlength != 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })

                this.mvtmoin = this.mvtmoin.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => true)
                  if (mvtlength == el.mvts.length || mvtlength != 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })
              }
            }
          }
        }
      } else {
        if (this.listselectcateg != null && this.listselectcateg.length > 0) {
          if (this.dequantite != null) {
            if (this.aquantite != null) {
              if (this.datecreation != null) {
                this.mvts = this.mvts.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.sens == this.sens && val.quantite >= this.dequantite && val.quantite <= this.aquantite && this._DateService.checkdate(this.datecreation, val.dateMvt))
                  if ((mvtlength == el.mvts.length || mvtlength != 0) && this.listselectcateg.filter(vall => vall.idProduit == el.idProduit).length > 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })

                this.mvtmoin = this.mvtmoin.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.sens == this.sens && val.quantite >= this.dequantite && val.quantite <= this.aquantite && this._DateService.checkdate(this.datecreation, val.dateMvt))
                  if ((mvtlength == el.mvts.length || mvtlength != 0) && this.listselectcateg.filter(vall => vall.idProduit == el.idProduit).length > 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })
              } else {
                this.mvts = this.mvts.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.sens == this.sens && val.quantite >= this.dequantite && val.quantite <= this.aquantite)
                  if ((mvtlength == el.mvts.length || mvtlength != 0) && this.listselectcateg.filter(vall => vall.idProduit == el.idProduit).length > 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })

                this.mvtmoin = this.mvtmoin.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.sens == this.sens && val.quantite >= this.dequantite && val.quantite <= this.aquantite)
                  if ((mvtlength == el.mvts.length || mvtlength != 0) && this.listselectcateg.filter(vall => vall.idProduit == el.idProduit).length > 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })
              }
            } else {
              if (this.datecreation != null) {
                this.mvts = this.mvts.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.sens == this.sens && val.quantite >= this.dequantite && this._DateService.checkdate(this.datecreation, val.dateMvt))
                  if ((mvtlength == el.mvts.length || mvtlength != 0) && this.listselectcateg.filter(vall => vall.idProduit == el.idProduit).length > 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })

                this.mvtmoin = this.mvtmoin.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.sens == this.sens && val.quantite >= this.dequantite && this._DateService.checkdate(this.datecreation, val.dateMvt))
                  if ((mvtlength == el.mvts.length || mvtlength != 0) && this.listselectcateg.filter(vall => vall.idProduit == el.idProduit).length > 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })
              } else {
                this.mvts = this.mvts.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.sens == this.sens && val.quantite >= this.dequantite && val.quantite <= this.aquantite)
                  if ((mvtlength == el.mvts.length || mvtlength != 0) && this.listselectcateg.filter(vall => vall.idProduit == el.idProduit).length > 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })

                this.mvtmoin = this.mvtmoin.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.sens == this.sens && val.quantite >= this.dequantite && val.quantite <= this.aquantite)
                  if ((mvtlength == el.mvts.length || mvtlength != 0) && this.listselectcateg.filter(vall => vall.idProduit == el.idProduit).length > 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })
              }
            }
          } else {
            if (this.aquantite != null) {
              if (this.datecreation != null) {
                this.mvts = this.mvts.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.sens == this.sens && val.quantite <= this.aquantite && this._DateService.checkdate(this.datecreation, val.dateMvt))
                  if ((mvtlength == el.mvts.length || mvtlength != 0) && this.listselectcateg.filter(vall => vall.idProduit == el.idProduit).length > 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })

                this.mvtmoin = this.mvtmoin.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.sens == this.sens && val.quantite <= this.aquantite && this._DateService.checkdate(this.datecreation, val.dateMvt))
                  if ((mvtlength == el.mvts.length || mvtlength != 0) && this.listselectcateg.filter(vall => vall.idProduit == el.idProduit).length > 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })
              } else {
                this.mvts = this.mvts.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.sens == this.sens && val.quantite <= this.aquantite)
                  if ((mvtlength == el.mvts.length || mvtlength != 0) && this.listselectcateg.filter(vall => vall.idProduit == el.idProduit).length > 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })

                this.mvtmoin = this.mvtmoin.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.sens == this.sens && val.quantite <= this.aquantite)
                  if ((mvtlength == el.mvts.length || mvtlength != 0) && this.listselectcateg.filter(vall => vall.idProduit == el.idProduit).length > 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })
              }
            } else {
              if (this.datecreation != null) {
                this.mvts = this.mvts.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.sens == this.sens && this._DateService.checkdate(this.datecreation, val.dateMvt))
                  if ((mvtlength == el.mvts.length || mvtlength != 0) && this.listselectcateg.filter(vall => vall.idProduit == el.idProduit).length > 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })

                this.mvtmoin = this.mvtmoin.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.sens == this.sens && this._DateService.checkdate(this.datecreation, val.dateMvt))
                  if ((mvtlength == el.mvts.length || mvtlength != 0) && this.listselectcateg.filter(vall => vall.idProduit == el.idProduit).length > 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })
              } else {
                this.mvts = this.mvts.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.sens == this.sens)
                  if ((mvtlength == el.mvts.length || mvtlength != 0) && this.listselectcateg.filter(vall => vall.idProduit == el.idProduit).length > 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })

                this.mvtmoin = this.mvtmoin.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.sens == this.sens)
                  if ((mvtlength == el.mvts.length || mvtlength != 0) && this.listselectcateg.filter(vall => vall.idProduit == el.idProduit).length > 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })
              }
            }
          }
        } else {
          if (this.dequantite != null) {
            if (this.aquantite != null) {
              if (this.datecreation != null) {
                this.mvts = this.mvts.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.sens == this.sens && val.quantite >= this.dequantite && val.quantite <= this.aquantite && this._DateService.checkdate(this.datecreation, val.dateMvt))
                  if (mvtlength == el.mvts.length || mvtlength != 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })

                this.mvtmoin = this.mvtmoin.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.sens == this.sens && val.quantite >= this.dequantite && val.quantite <= this.aquantite && this._DateService.checkdate(this.datecreation, val.dateMvt))
                  if (mvtlength == el.mvts.length || mvtlength != 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })
              } else {
                this.mvts = this.mvts.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.sens == this.sens && val.quantite >= this.dequantite && val.quantite <= this.aquantite)
                  if (mvtlength == el.mvts.length || mvtlength != 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })

                this.mvtmoin = this.mvtmoin.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.sens == this.sens && val.quantite >= this.dequantite && val.quantite <= this.aquantite)
                  if (mvtlength == el.mvts.length || mvtlength != 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })
                // this.mvts=this.mvts.filter(el=> el.prixPack>=this.dequantite && el.prixPack<=this.aquantite )          
              }
            } else {
              if (this.datecreation != null) {
                // this.mvts=this.mvts.filter(el=> el.prixPack>=this.dequantite && this._DateService.checkdate(this.datecreation,el.dateCreation) )          
                this.mvts = this.mvts.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.sens == this.sens && val.quantite >= this.dequantite && this._DateService.checkdate(this.datecreation, val.dateMvt))
                  if (mvtlength == el.mvts.length || mvtlength != 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })

                this.mvtmoin = this.mvtmoin.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.sens == this.sens && val.quantite >= this.dequantite && this._DateService.checkdate(this.datecreation, val.dateMvt))
                  if (mvtlength == el.mvts.length || mvtlength != 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })
              } else {
                this.mvts = this.mvts.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.sens == this.sens && val.quantite >= this.dequantite)
                  if (mvtlength == el.mvts.length || mvtlength != 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })

                this.mvtmoin = this.mvtmoin.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.sens == this.sens && val.quantite >= this.dequantite)
                  if (mvtlength == el.mvts.length || mvtlength != 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })
                // this.mvts=this.mvts.filter(el=> el.prixPack>=this.dequantite )          
              }
            }
          } else {
            if (this.aquantite != null) {
              if (this.datecreation != null) {
                // this.mvts=this.mvts.filter(el=>  el.prixPack<=this.aquantite && this._DateService.checkdate(this.datecreation,el.dateCreation) )          
                this.mvts = this.mvts.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.sens == this.sens && val.quantite <= this.aquantite && this._DateService.checkdate(this.datecreation, val.dateMvt))
                  if (mvtlength == el.mvts.length || mvtlength != 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })

                this.mvtmoin = this.mvtmoin.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.sens == this.sens && val.quantite <= this.aquantite && this._DateService.checkdate(this.datecreation, val.dateMvt))
                  if (mvtlength == el.mvts.length || mvtlength != 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })
              } else {
                // this.mvts=this.mvts.filter(el=>  el.prixPack<=this.aquantite )   
                this.mvts = this.mvts.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.sens == this.sens && val.quantite <= this.aquantite)
                  if (mvtlength == el.mvts.length || mvtlength != 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })

                this.mvtmoin = this.mvtmoin.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.sens == this.sens && val.quantite <= this.aquantite)
                  if (mvtlength == el.mvts.length || mvtlength != 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })
              }
            } else {
              if (this.datecreation != null) {
                this.mvts = this.mvts.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.sens == this.sens && this._DateService.checkdate(this.datecreation, val.dateMvt))
                  if (mvtlength == el.mvts.length || mvtlength != 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })

                this.mvtmoin = this.mvtmoin.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.sens == this.sens && this._DateService.checkdate(this.datecreation, val.dateMvt))
                  if (mvtlength == el.mvts.length || mvtlength != 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })
                // this.mvts=this.mvts.filter(el=> this._DateService.checkdate(this.datecreation,el.dateCreation) )          
              } else {
                // this.mvts=this.mvts.filter(el=>true)  
                this.mvts = this.mvts.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.sens == this.sens)
                  if (mvtlength == el.mvts.length || mvtlength != 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })


                this.mvtmoin = this.mvtmoin.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.sens == this.sens)
                  if (mvtlength == el.mvts.length || mvtlength != 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })
              }
            }
          }
        }
      }
    } else {
      if (this.sens == null) {
        if (this.listselectcateg != null && this.listselectcateg.length > 0) {
          if (this.dequantite != null) {
            if (this.aquantite != null) {
              if (this.datecreation != null) {
                this.mvts = this.mvts.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.quantite >= this.dequantite && val.quantite <= this.aquantite && this._DateService.check2date(this.datecreation, this.datefincreation, val.dateMvt))
                  if ((mvtlength == el.mvts.length || mvtlength != 0) && this.listselectcateg.filter(vall => vall.idProduit == el.idProduit).length > 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })

                this.mvtmoin = this.mvtmoin.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.quantite >= this.dequantite && val.quantite <= this.aquantite && this._DateService.check2date(this.datecreation, this.datefincreation, val.dateMvt))
                  if ((mvtlength == el.mvts.length || mvtlength != 0) && this.listselectcateg.filter(vall => vall.idProduit == el.idProduit).length > 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })
              } else {
                this.mvts = this.mvts.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.quantite >= this.dequantite && val.quantite <= this.aquantite)
                  if ((mvtlength == el.mvts.length || mvtlength != 0) && this.listselectcateg.filter(vall => vall.idProduit == el.idProduit).length > 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })

                this.mvtmoin = this.mvtmoin.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.quantite >= this.dequantite && val.quantite <= this.aquantite)
                  if ((mvtlength == el.mvts.length || mvtlength != 0) && this.listselectcateg.filter(vall => vall.idProduit == el.idProduit).length > 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })
              }
            } else {
              if (this.datecreation != null) {
                this.mvts = this.mvts.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.quantite >= this.dequantite && this._DateService.check2date(this.datecreation, this.datefincreation, val.dateMvt))
                  if ((mvtlength == el.mvts.length || mvtlength != 0) && this.listselectcateg.filter(vall => vall.idProduit == el.idProduit).length > 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })

                this.mvtmoin = this.mvtmoin.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.quantite >= this.dequantite && this._DateService.check2date(this.datecreation, this.datefincreation, val.dateMvt))
                  if ((mvtlength == el.mvts.length || mvtlength != 0) && this.listselectcateg.filter(vall => vall.idProduit == el.idProduit).length > 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })
              } else {
                this.mvts = this.mvts.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.quantite >= this.dequantite && val.quantite <= this.aquantite)
                  if ((mvtlength == el.mvts.length || mvtlength != 0) && this.listselectcateg.filter(vall => vall.idProduit == el.idProduit).length > 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })

                this.mvtmoin = this.mvtmoin.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.quantite >= this.dequantite && val.quantite <= this.aquantite)
                  if ((mvtlength == el.mvts.length || mvtlength != 0) && this.listselectcateg.filter(vall => vall.idProduit == el.idProduit).length > 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })
              }
            }
          } else {
            if (this.aquantite != null) {
              if (this.datecreation != null) {
                this.mvts = this.mvts.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.quantite <= this.aquantite && this._DateService.check2date(this.datecreation, this.datefincreation, val.dateMvt))
                  if ((mvtlength == el.mvts.length || mvtlength != 0) && this.listselectcateg.filter(vall => vall.idProduit == el.idProduit).length > 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })

                this.mvtmoin = this.mvtmoin.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.quantite <= this.aquantite && this._DateService.check2date(this.datecreation, this.datefincreation, val.dateMvt))
                  if ((mvtlength == el.mvts.length || mvtlength != 0) && this.listselectcateg.filter(vall => vall.idProduit == el.idProduit).length > 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })
              } else {
                this.mvts = this.mvts.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.quantite <= this.aquantite)
                  if ((mvtlength == el.mvts.length || mvtlength != 0) && this.listselectcateg.filter(vall => vall.idProduit == el.idProduit).length > 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })

                this.mvtmoin = this.mvtmoin.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.quantite <= this.aquantite)
                  if ((mvtlength == el.mvts.length || mvtlength != 0) && this.listselectcateg.filter(vall => vall.idProduit == el.idProduit).length > 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })
              }
            } else {
              if (this.datecreation != null) {
                this.mvts = this.mvts.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => this._DateService.check2date(this.datecreation, this.datefincreation, val.dateMvt))
                  if ((mvtlength == el.mvts.length || mvtlength != 0) && this.listselectcateg.filter(vall => vall.idProduit == el.idProduit).length > 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })

                this.mvtmoin = this.mvtmoin.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => this._DateService.check2date(this.datecreation, this.datefincreation, val.dateMvt))
                  if ((mvtlength == el.mvts.length || mvtlength != 0) && this.listselectcateg.filter(vall => vall.idProduit == el.idProduit).length > 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })
              } else {
                this.mvts = this.mvts.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => true)
                  if ((mvtlength == el.mvts.length || mvtlength != 0) && this.listselectcateg.filter(vall => vall.idProduit == el.idProduit).length > 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })

                this.mvtmoin = this.mvtmoin.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => true)
                  if ((mvtlength == el.mvts.length || mvtlength != 0) && this.listselectcateg.filter(vall => vall.idProduit == el.idProduit).length > 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })
              }
            }
          }
        } else {
          if (this.dequantite != null) {
            if (this.aquantite != null) {
              if (this.datecreation != null) {
                this.mvts = this.mvts.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.quantite >= this.dequantite && val.quantite <= this.aquantite && this._DateService.check2date(this.datecreation, this.datefincreation, val.dateMvt))
                  if (mvtlength == el.mvts.length || mvtlength != 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })

                this.mvtmoin = this.mvtmoin.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.quantite >= this.dequantite && val.quantite <= this.aquantite && this._DateService.check2date(this.datecreation, this.datefincreation, val.dateMvt))
                  if (mvtlength == el.mvts.length || mvtlength != 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })
              } else {
                this.mvts = this.mvts.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.quantite >= this.dequantite && val.quantite <= this.aquantite)
                  if (mvtlength == el.mvts.length || mvtlength != 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })

                this.mvtmoin = this.mvtmoin.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.quantite >= this.dequantite && val.quantite <= this.aquantite)
                  if (mvtlength == el.mvts.length || mvtlength != 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })
                // this.mvts=this.mvts.filter(el=> el.prixPack>=this.dequantite && el.prixPack<=this.aquantite )          
              }
            } else {
              if (this.datecreation != null) {
                // this.mvts=this.mvts.filter(el=> el.prixPack>=this.dequantite && this._DateService.checkdate(this.datecreation,el.dateCreation) )          
                this.mvts = this.mvts.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.quantite >= this.dequantite && this._DateService.check2date(this.datecreation, this.datefincreation, val.dateMvt))
                  if (mvtlength == el.mvts.length || mvtlength != 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })

                this.mvtmoin = this.mvtmoin.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.quantite >= this.dequantite && this._DateService.check2date(this.datecreation, this.datefincreation, val.dateMvt))
                  if (mvtlength == el.mvts.length || mvtlength != 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })
              } else {
                this.mvts = this.mvts.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.quantite >= this.dequantite)
                  if (mvtlength == el.mvts.length || mvtlength != 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })

                this.mvtmoin = this.mvtmoin.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.quantite >= this.dequantite)
                  if (mvtlength == el.mvts.length || mvtlength != 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })
                // this.mvts=this.mvts.filter(el=> el.prixPack>=this.dequantite )          
              }
            }
          } else {
            if (this.aquantite != null) {
              if (this.datecreation != null) {
                // this.mvts=this.mvts.filter(el=>  el.prixPack<=this.aquantite && this._DateService.checkdate(this.datecreation,el.dateCreation) )          
                this.mvts = this.mvts.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.quantite <= this.aquantite && this._DateService.check2date(this.datecreation, this.datefincreation, val.dateMvt))
                  if (mvtlength == el.mvts.length || mvtlength != 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })

                this.mvtmoin = this.mvtmoin.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.quantite <= this.aquantite && this._DateService.check2date(this.datecreation, this.datefincreation, val.dateMvt))
                  if (mvtlength == el.mvts.length || mvtlength != 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })
              } else {
                // this.mvts=this.mvts.filter(el=>  el.prixPack<=this.aquantite )   
                this.mvts = this.mvts.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.quantite <= this.aquantite)
                  if (mvtlength == el.mvts.length || mvtlength != 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })

                this.mvtmoin = this.mvtmoin.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.quantite <= this.aquantite)
                  if (mvtlength == el.mvts.length || mvtlength != 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })
              }
            } else {
              if (this.datecreation != null) {
                this.mvts = this.mvts.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => this._DateService.check2date(this.datecreation, this.datefincreation, val.dateMvt))
                  if (mvtlength == el.mvts.length || mvtlength != 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })

                this.mvtmoin = this.mvtmoin.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => this._DateService.check2date(this.datecreation, this.datefincreation, val.dateMvt))
                  if (mvtlength == el.mvts.length || mvtlength != 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })
                // this.mvts=this.mvts.filter(el=> this._DateService.checkdate(this.datecreation,el.dateCreation) )          
              } else {
                // this.mvts=this.mvts.filter(el=>true)  
                this.mvts = this.mvts.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => true)
                  if (mvtlength == el.mvts.length || mvtlength != 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })

                this.mvtmoin = this.mvtmoin.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => true)
                  if (mvtlength == el.mvts.length || mvtlength != 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })
              }
            }
          }
        }
      } else {
        if (this.listselectcateg != null && this.listselectcateg.length > 0) {
          if (this.dequantite != null) {
            if (this.aquantite != null) {
              if (this.datecreation != null) {
                this.mvts = this.mvts.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.sens == this.sens && val.quantite >= this.dequantite && val.quantite <= this.aquantite && this._DateService.check2date(this.datecreation, this.datefincreation, val.dateMvt))
                  if ((mvtlength == el.mvts.length || mvtlength != 0) && this.listselectcateg.filter(vall => vall.idProduit == el.idProduit).length > 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })

                this.mvtmoin = this.mvtmoin.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.sens == this.sens && val.quantite >= this.dequantite && val.quantite <= this.aquantite && this._DateService.check2date(this.datecreation, this.datefincreation, val.dateMvt))
                  if ((mvtlength == el.mvts.length || mvtlength != 0) && this.listselectcateg.filter(vall => vall.idProduit == el.idProduit).length > 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })
              } else {
                this.mvts = this.mvts.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.sens == this.sens && val.quantite >= this.dequantite && val.quantite <= this.aquantite)
                  if ((mvtlength == el.mvts.length || mvtlength != 0) && this.listselectcateg.filter(vall => vall.idProduit == el.idProduit).length > 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })

                this.mvtmoin = this.mvtmoin.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.sens == this.sens && val.quantite >= this.dequantite && val.quantite <= this.aquantite)
                  if ((mvtlength == el.mvts.length || mvtlength != 0) && this.listselectcateg.filter(vall => vall.idProduit == el.idProduit).length > 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })
              }
            } else {
              if (this.datecreation != null) {
                this.mvts = this.mvts.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.sens == this.sens && val.quantite >= this.dequantite && this._DateService.check2date(this.datecreation, this.datefincreation, val.dateMvt))
                  if ((mvtlength == el.mvts.length || mvtlength != 0) && this.listselectcateg.filter(vall => vall.idProduit == el.idProduit).length > 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })

                this.mvtmoin = this.mvtmoin.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.sens == this.sens && val.quantite >= this.dequantite && this._DateService.check2date(this.datecreation, this.datefincreation, val.dateMvt))
                  if ((mvtlength == el.mvts.length || mvtlength != 0) && this.listselectcateg.filter(vall => vall.idProduit == el.idProduit).length > 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })
              } else {
                this.mvts = this.mvts.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.sens == this.sens && val.quantite >= this.dequantite && val.quantite <= this.aquantite)
                  if ((mvtlength == el.mvts.length || mvtlength != 0) && this.listselectcateg.filter(vall => vall.idProduit == el.idProduit).length > 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })

                this.mvtmoin = this.mvtmoin.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.sens == this.sens && val.quantite >= this.dequantite && val.quantite <= this.aquantite)
                  if ((mvtlength == el.mvts.length || mvtlength != 0) && this.listselectcateg.filter(vall => vall.idProduit == el.idProduit).length > 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })
              }
            }
          } else {
            if (this.aquantite != null) {
              if (this.datecreation != null) {
                this.mvts = this.mvts.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.sens == this.sens && val.quantite <= this.aquantite && this._DateService.check2date(this.datecreation, this.datefincreation, val.dateMvt))
                  if ((mvtlength == el.mvts.length || mvtlength != 0) && this.listselectcateg.filter(vall => vall.idProduit == el.idProduit).length > 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })

                this.mvtmoin = this.mvtmoin.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.sens == this.sens && val.quantite <= this.aquantite && this._DateService.check2date(this.datecreation, this.datefincreation, val.dateMvt))
                  if ((mvtlength == el.mvts.length || mvtlength != 0) && this.listselectcateg.filter(vall => vall.idProduit == el.idProduit).length > 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })
              } else {
                this.mvts = this.mvts.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.sens == this.sens && val.quantite <= this.aquantite)
                  if ((mvtlength == el.mvts.length || mvtlength != 0) && this.listselectcateg.filter(vall => vall.idProduit == el.idProduit).length > 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })

                this.mvtmoin = this.mvtmoin.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.sens == this.sens && val.quantite <= this.aquantite)
                  if ((mvtlength == el.mvts.length || mvtlength != 0) && this.listselectcateg.filter(vall => vall.idProduit == el.idProduit).length > 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })
              }
            } else {
              if (this.datecreation != null) {
                this.mvts = this.mvts.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.sens == this.sens && this._DateService.check2date(this.datecreation, this.datefincreation, val.dateMvt))
                  if ((mvtlength == el.mvts.length || mvtlength != 0) && this.listselectcateg.filter(vall => vall.idProduit == el.idProduit).length > 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })

                this.mvtmoin = this.mvtmoin.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.sens == this.sens && this._DateService.check2date(this.datecreation, this.datefincreation, val.dateMvt))
                  if ((mvtlength == el.mvts.length || mvtlength != 0) && this.listselectcateg.filter(vall => vall.idProduit == el.idProduit).length > 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })
              } else {
                this.mvts = this.mvts.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.sens == this.sens)
                  if ((mvtlength == el.mvts.length || mvtlength != 0) && this.listselectcateg.filter(vall => vall.idProduit == el.idProduit).length > 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })

                this.mvtmoin = this.mvtmoin.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.sens == this.sens)
                  if ((mvtlength == el.mvts.length || mvtlength != 0) && this.listselectcateg.filter(vall => vall.idProduit == el.idProduit).length > 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })
              }
            }
          }
        } else {
          if (this.dequantite != null) {
            if (this.aquantite != null) {
              if (this.datecreation != null) {
                this.mvts = this.mvts.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.sens == this.sens && val.quantite >= this.dequantite && val.quantite <= this.aquantite && this._DateService.check2date(this.datecreation, this.datefincreation, val.dateMvt))
                  if (mvtlength == el.mvts.length || mvtlength != 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })

                this.mvtmoin = this.mvtmoin.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.sens == this.sens && val.quantite >= this.dequantite && val.quantite <= this.aquantite && this._DateService.check2date(this.datecreation, this.datefincreation, val.dateMvt))
                  if (mvtlength == el.mvts.length || mvtlength != 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })
              } else {
                this.mvts = this.mvts.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.sens == this.sens && val.quantite >= this.dequantite && val.quantite <= this.aquantite)
                  if (mvtlength == el.mvts.length || mvtlength != 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })

                this.mvtmoin = this.mvtmoin.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.sens == this.sens && val.quantite >= this.dequantite && val.quantite <= this.aquantite)
                  if (mvtlength == el.mvts.length || mvtlength != 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })
                // this.mvts=this.mvts.filter(el=> el.prixPack>=this.dequantite && el.prixPack<=this.aquantite )          
              }
            } else {
              if (this.datecreation != null) {
                // this.mvts=this.mvts.filter(el=> el.prixPack>=this.dequantite && this._DateService.checkdate(this.datecreation,el.dateCreation) )          
                this.mvts = this.mvts.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.sens == this.sens && val.quantite >= this.dequantite && this._DateService.check2date(this.datecreation, this.datefincreation, val.dateMvt))
                  if (mvtlength == el.mvts.length || mvtlength != 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })

                this.mvtmoin = this.mvtmoin.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.sens == this.sens && val.quantite >= this.dequantite && this._DateService.check2date(this.datecreation, this.datefincreation, val.dateMvt))
                  if (mvtlength == el.mvts.length || mvtlength != 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })
              } else {
                this.mvts = this.mvts.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.sens == this.sens && val.quantite >= this.dequantite)
                  if (mvtlength == el.mvts.length || mvtlength != 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })

                this.mvtmoin = this.mvtmoin.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.sens == this.sens && val.quantite >= this.dequantite)
                  if (mvtlength == el.mvts.length || mvtlength != 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })
                // this.mvts=this.mvts.filter(el=> el.prixPack>=this.dequantite )          
              }
            }
          } else {
            if (this.aquantite != null) {
              if (this.datecreation != null) {
                // this.mvts=this.mvts.filter(el=>  el.prixPack<=this.aquantite && this._DateService.checkdate(this.datecreation,el.dateCreation) )          
                this.mvts = this.mvts.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.sens == this.sens && val.quantite <= this.aquantite && this._DateService.check2date(this.datecreation, this.datefincreation, val.dateMvt))
                  if (mvtlength == el.mvts.length || mvtlength != 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })

                this.mvtmoin = this.mvtmoin.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.sens == this.sens && val.quantite <= this.aquantite && this._DateService.check2date(this.datecreation, this.datefincreation, val.dateMvt))
                  if (mvtlength == el.mvts.length || mvtlength != 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })

              } else {
                // this.mvts=this.mvts.filter(el=>  el.prixPack<=this.aquantite )   
                this.mvts = this.mvts.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.sens == this.sens && val.quantite <= this.aquantite)
                  if (mvtlength == el.mvts.length || mvtlength != 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })

                this.mvtmoin = this.mvtmoin.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.sens == this.sens && val.quantite <= this.aquantite)
                  if (mvtlength == el.mvts.length || mvtlength != 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })
              }
            } else {
              if (this.datecreation != null) {
                this.mvts = this.mvts.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.sens == this.sens && this._DateService.check2date(this.datecreation, this.datefincreation, val.dateMvt))
                  if (mvtlength == el.mvts.length || mvtlength != 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })

                this.mvtmoin = this.mvtmoin.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.sens == this.sens && this._DateService.check2date(this.datecreation, this.datefincreation, val.dateMvt))
                  if (mvtlength == el.mvts.length || mvtlength != 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })
                // this.mvts=this.mvts.filter(el=> this._DateService.checkdate(this.datecreation,el.dateCreation) )          
              } else {
                // this.mvts=this.mvts.filter(el=>true)  
                this.mvts = this.mvts.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.sens == this.sens)
                  if (mvtlength == el.mvts.length || mvtlength != 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })

                this.mvtmoin = this.mvtmoin.filter(el => {
                  let mvtlength: number = el.mvts.length
                  el.mvts = el.mvts.filter(val => val.sens == this.sens)
                  if (mvtlength == el.mvts.length || mvtlength != 0) {
                    if (el.mvts.length != 0) {
                      return true
                    }
                    return false
                  } else {
                    return false
                  }
                })
              }
            }
          }
        }
      }



    }
  }

  newSearch() {
    this.annuler()
    this.fannule = true
    if (this.listselectcateg && this.listselectcateg.length > 0) {
      this.mvtmoin = this.filterByProducts(this.listselectcateg, this.mvtmoin);
      this.mvts = this.filterByProducts(this.listselectcateg, this.mvts);
    }
    if (this.dequantite) {
      this.mvts = this.filterByStartQuantite(this.dequantite, this.mvts);
      this.mvtmoin = this.filterByStartQuantite(this.dequantite, this.mvtmoin);
    }
    if (this.aquantite) {
      this.mvts = this.filterByEndQuantite(this.aquantite, this.mvts);
      this.mvtmoin = this.filterByEndQuantite(this.aquantite, this.mvtmoin);
    }
    if (this.selectedPv) {
      this.mvts = this.filterByPointVente(this.selectedPv, this.mvts);
      this.mvtmoin = this.filterByPointVente(this.selectedPv, this.mvtmoin);
      this.canCheak = true;
    }
    if (this.sens) {
      this.mvts = this.filterByOperation(this.sens, this.mvts);
      this.mvtmoin = this.filterByOperation(this.sens, this.mvtmoin);
    }
    if (this.datecreation && this.datefincreation) {
      this.mvts = this.filterBy2Date(this.datecreation, this.datefincreation, this.mvts);
      this.mvtmoin = this.filterBy2Date(this.datecreation, this.datefincreation, this.mvtmoin);
    } else if (this.datecreation) {
      this.mvts = this.filterByDate(this.datecreation, this.mvts);
      this.mvtmoin = this.filterByDate(this.datecreation, this.mvtmoin);
    } else if (this.datefincreation) {
      this.mvts = this.filterByDate(this.datefincreation, this.mvts);
      this.mvtmoin = this.filterByDate(this.datefincreation, this.mvtmoin);
    }
  }

  private filterByProducts(ListProduct: any[], mvts: MvtDto[]): MvtDto[] {
    console.log(ListProduct);
    return mvts.filter(element => ListProduct.filter(val => val.idProduit == element.idProduit).length > 0)
  }

  private filterByPointVente(pv: PointVente, mvts: MvtDto[]): MvtDto[] {
    this.tabsetEl.selectTab(this.mvtSortant)
    return mvts.filter(element => {
      element.mvts = element.mvts.filter(val => val.idPointVenteDest == pv.idPointVente);
      return element.mvts.length > 0;
    })

  }

  private filterByOperation(operation: string, mvts: MvtDto[]): MvtDto[] {
    return mvts.filter(element => {
      element.mvts = element.mvts.filter(val => val.sens == operation);
      return element.mvts.length > 0;
    })
  }

  private filterByDate(date: Date, mvts: MvtDto[]): MvtDto[] {
    return mvts.filter(element => {
      element.mvts = element.mvts.filter(val => this._DateService.checkdate(date, val.dateMvt));
      return element.mvts.length > 0;
    })
  }

  private filterBy2Date(startDate: Date, endDate: Date, mvts: MvtDto[]): MvtDto[] {
    return mvts.filter(element => {
      element.mvts = element.mvts.filter(val => this._DateService.check2date(startDate, endDate, val.dateMvt));
      return element.mvts.length > 0;
    })
  }

  private filterByStartQuantite(quantite: number, mvts: MvtDto[]): MvtDto[] {
    return mvts.filter(element => {
      element.mvts = element.mvts.filter(val => val.quantite >= quantite);
      return element.mvts.length > 0;
    })
  }

  private filterByEndQuantite(quantite: number, mvts: MvtDto[]): MvtDto[] {
    return mvts.filter(element => {
      element.mvts = element.mvts.filter(val => val.quantite <= quantite);
      return element.mvts.length > 0;
    })
  }

  public diplay: boolean;

  exportPdf() {
    let bonCommande: BonCommande = new BonCommande();
    bonCommande.idPointVente = this.selectedPv.idPointVente;
    bonCommande.generatedDate = new Date();
    bonCommande.mvtStockProducts = [];
    bonCommande.idPartenaire = localStorage.getItem("partenaireid");
    var min = 10000;
    var max = 80000;
    var num = Math.floor(Math.random() * min) + max;

    let refeance = "LC0" + num;
    import("jspdf").then(jsPDF => {
      import("jspdf-autotable").then(x => {
        const doc = new jsPDF.default("p", "pt");
        var width = doc.internal.pageSize.getWidth()
        doc.text(this.partenaire.abbreviation, width / 2, 35, { align: 'center' });
        doc.text(this.selectedPv.adresse, width / 2, 55, { align: 'center' });
        doc.line(0, 70, width, 70);
        doc.setDrawColor(0);
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(20, 100, 270, 110, 3, 3, 'FD');
        doc.text("BON DE LIVRAISION", 40, 120);
        doc.line(20, 130, 290, 130);
        doc.text("Référence :           " + refeance, 40, 160);
        doc.text("Date :                    " + new Date().toLocaleDateString(), 40, 180);
        doc.text('PV : ' + this.selectedPv.designation, 3 * width / 4, 140, { align: 'center' });
        doc.text(new Date().toLocaleDateString() + " - " + new Date().toLocaleTimeString(), 2.5 * width / 4, 160), { align: 'center' };
        let rows: any[] = []

        let prixTotale = 0;
        this.selectedMvts.forEach(mvt => {
          mvt.mvts.forEach(item => {
            let mvtStockProduct: MvtStockProduct = new MvtStockProduct();
            mvtStockProduct.mvtStock = item;
            mvtStockProduct.productName = mvt.produit.designation
            bonCommande.mvtStockProducts.push(mvtStockProduct);
            let row: string[] = []
            row.push(mvt.produit.designation);
            row.push(item.quantite);
            row.push(item.mesureConversion);
            row.push(item.qteConversion);
            row.push(item.prixVente);
            if (item.prixVente)
              prixTotale += item.prixVente
            rows.push(row);
          })
        })
        doc.line(50, 230, width - 50, 230);
        doc.line(50, 231, width - 50, 231);
        autoTable(doc, {
          head: [['Désignation', 'Qte/portion', 'Unité', 'Qte(conversion)', 'Prix de vente']],
          body: rows,
          margin: { top: 240 },
          styles: {
            overflow: 'ellipsize',
            fontSize: 15
          },
          headStyles: { fillColor: '#E8E8E8', textColor: '#000' },
          theme: 'grid'
        });

        doc.line(50, 270 + (50 * rows.length), width - 50, 270 + (50 * rows.length));
        doc.line(50, 270 + (50 * rows.length) + 1, width - 50, 270 + (50 * rows.length) + 1);
        // let finalY = (doc as any).getLastAutoTable().finalY;
        doc.text('Total : ' + prixTotale, 3 * width / 4, 270 + (50 * rows.length) + 20);
        var str = "Page 1";
        doc.text(str, width - 100, doc.internal.pageSize.height - 15);//key is the interal pageSize function

        doc.save('bon_de_commande_' + refeance + '_' + new Date().toLocaleString() + '.pdf');
        bonCommande.referance = refeance;
        bonCommande.total = prixTotale;
        this.bonCommandeService.CreateBonCommande(bonCommande).subscribe(val => {
          console.log(val);

        })
      })
    })

  }

}
