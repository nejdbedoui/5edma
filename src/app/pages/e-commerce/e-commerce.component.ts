import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { PartnerAnalyticsEndPointService } from "../../service/bp-api-analytics/partner-analytics-end-point/partner-analytics-end-point.service";
import { DatePipe } from "@angular/common";
import { log } from "util";
import { PointVenteEndPointService } from "../../service/bp-api-pos/point-vente-end-point/point-vente-end-point.service";
import { PointVente } from "../../model/PointVente";
import { NbColorHelper, NbThemeService } from "@nebular/theme";
import { ClientAnalyticsEndPointService } from "../../service/bp-api-analytics/client-analytics-end-point/client-analytics-end-point.service";
import { ClientDto } from "../../model/dto/ClientDto";
import { SessionEndPointService } from "../../service/bp-api-pos/session-end-point/session-end-point.service";
import { DepanceDto } from "../../model/dto/DepanceDto";
import { OperationTypeEndPointService } from "../../service/bp-api-transaction/operation-type-end-point/operation-type-end-point.service";
import * as jspdf from "jspdf";
import * as html2canvas from "html2canvas";
// import {autoTable} from 'jspdf-autotable'
import autoTable from "jspdf-autotable";
import { CommandeEndPointService } from "../../service/bp-api-transaction/commande-end-point/commande-end-point.service";
import { ProductEndPointService } from "../../service/bp-api-product/product-end-point/product-end-point.service";
import { CategorieEndPointService } from "../../service/bp-api-product/categorie-end-point/categorie-end-point.service";
import { GroupeClientPartenaireEndPointService } from "../../service/bp-api-customer/groupe-client-partenaire-end-point/groupe-client-partenaire-end-point.service";
import { ReglesFideliteProduitEndPointService } from "../../service/bp-api-loyality/regles-fidelite-produit-end-point/regles-fidelite-produit-end-point.service";
import { MvtStockEndPointService } from "../../service/bp-api-product/mvt-stock-end-point/mvt-stock-end-point.service";
import { MvtDto } from "../../model/dto/MvtDto";
import { Session } from '../../model/Session';
@Component({
  selector: "ngx-ecommerce",
  templateUrl: "./e-commerce.component.html",
  styleUrls: ["./e-commerce.component.scss"],
})
export class ECommerceComponent implements OnInit, OnDestroy {
  today: Date = new Date();
  pointVenteId: string = localStorage.getItem("pointventeid");
  bpPartnerId: string = localStorage.getItem("partenaireid");
  connectedUser: string = localStorage.getItem("UserId");
  todayCA: number = 0;
  nbrTicket: number = 0;
  panierMoy: number = 0;
  pointVente: PointVente = new PointVente();
  clientPassage: number = 0;
  data: any;
  options: any;
  themeSubscription: any;
  months: any = [
    "Janvier",
    "février",
    " mars",
    " avril",
    "mai",
    "juin",
    "juillet",
    "août",
    "septembre",
    "octobre",
    "novembre",
    "décembre",
  ];
  hours: any = [];
  hvalues: any = [
    65,
    59,
    80,
    81,
    56,
    55,
    40,
    80,
    81,
    56,
    55,
    40,
    65,
    59,
    80,
    81,
    56,
    55,
    40,
    80,
    81,
    56,
    55,
    40,
  ];
  values: any = [65, 59, 80, 81, 56, 55, 40, 80, 81, 56, 55, 40];
  typeCA: string;
  choises: any = [
    { label: "Par Journée", value: "J" },
    { label: "Par mois", value: "M" },
    { label: "Par Période", value: "P" },
  ];
  //choises:any = [{label:'Par Journée',value:'J'},{label:'Par mois',value:'M'},{label:'Cette semaine',value:'S'},{label:'Par Période',value:'P'}];
  choise: any;
  labels: any = [];
  datas: any = [];
  label: string = "";
  newClient: number = 0;
  flipped = false;
  flipped2 = false;
  listproducts: any[] = [];
  listpacks: any[] = [];
  listemplyes: any[] = [];
  mondayOfWeek = new Date(
    this.today.getFullYear(),
    this.today.getMonth(),
    this.today.getDate() - this.today.getDay() + 1
  );
  sundayOfWeek = new Date(
    this.today.getFullYear(),
    this.today.getMonth(),
    this.today.getDate() - this.today.getDay() + 7
  );
  today2: Date = new Date();
  pieProductdata: any = {};
  piePackdata: any = {};
  chartoptions: any;
  chartthemeSubscription: any;
  optionspie: any;
  nbrclientmobile: number = 0;
  nbrnewclient: number = 0;
  nbrnewclientmobile: number = 0;
  afficheproduit: boolean = true;
  cols: any[] = [];
  cols2: any[] = [];
  depanceDtos: DepanceDto[] = [];
  nbrCommandeAnnuler: number = 0;
  amountCommandeAnnuler: number = 0;
  type: boolean = false;
  mvts: MvtDto[] = [];
  mvtsSortant: MvtDto[] = [];
  mvtmoin: any[] = [];
  mvtplus: any[] = [];
  @ViewChild("chart", { static: false }) chart: ElementRef;
  constructor(
    private _PartnerAnalyticsEndPoint: PartnerAnalyticsEndPointService,
    private datePipe: DatePipe,
    private _PointVenteEndPointService: PointVenteEndPointService,
    private theme: NbThemeService,
    private _ClientAnalyticsEndPointService: ClientAnalyticsEndPointService,
    private _SessionEndPointService: SessionEndPointService,
    private _OperationTypeEndPointService: OperationTypeEndPointService,
    private _CommandeEndPointService: CommandeEndPointService,
    private _ProductEndPointService: ProductEndPointService,
    private _CategorieEndPointService: CategorieEndPointService,
    private _GroupeClientPartenaireEndPointService: GroupeClientPartenaireEndPointService,
    private _ReglesFideliteProduitEndPointService: ReglesFideliteProduitEndPointService,
    private _MvtStockEndPointService: MvtStockEndPointService
  ) { }

  ngOnInit(): void {
    this.gettypedpense();
    this.cols = [
      { field: "Capacité de la Table", header: "Capacité de la Table" },
      { field: "Numéro de la Table", header: "Numéro de la Table" },
      { field: "Action", header: "Action" },
      { field: "Capacité de la Table", header: "Capacité de la Table" },
      { field: "Numéro de la Table", header: "Numéro de la Table" },
      { field: "Action", header: "Action" },
      { field: "Capacité de la Table", header: "Capacité de la Table" },
      { field: "Numéro de la Table", header: "Numéro de la Table" },
    ];
    this.cols2 = [
      { field: "Capacité de la Table", header: "Capacité de la Table" },
      { field: "Numéro de la Table", header: "Numéro de la Table" },
    ];
    this.choise = this.choises[0].value;
    for (let i = 0; i < 24; i++) {
      this.hours.push(i + "h");
    }
    this.type = localStorage.getItem("type") == "1";

    this.journeeChart();
    this.loadWithDate();
    this.getproductbydate(this.today2, null);
    this.getListCAEmployeByPVAndDate(this.today2, null);
    this.getpackbydate(this.today2, null);
    // this.getAnnuledCommande();
    if (this.pointVenteId == null) {
      this.getAllReglefid();
      this.getAllGroupeClient();
      this.getAllCategorie();
      this.getAllProduct();
    }
    this._PointVenteEndPointService
      .findPointVenteByIdPointVente(this.pointVenteId)
      .subscribe((res) => {
        if (res.result == 1) {
          this.pointVente = res.objectResponse;
          if (this.pointVente.typePv == "centraleStock") {
            this._MvtStockEndPointService
              .findAllMctByIdPointVente(localStorage.getItem("pointventeid"))
              .subscribe(
                (pv) => {
                  this.loading = false;
                  if (pv.result == 1) {

                    this.mvts = pv.objectResponse;

                    this.mvts = this.mvts.filter((el) => {
                      let mvtlength: number = el.mvts.length;
                      el.mvts = el.mvts.filter((val) => val.sens == "+");
                      if (mvtlength == el.mvts.length || mvtlength != 0) {
                        if (el.mvts.length != 0) {
                          return true;
                        }
                        return false;
                      } else {
                        return false;
                      }
                    });
                    this.mvtplus = [];
                    this.mvts.forEach((el) => {
                      let mvt: MvtDto = new MvtDto();
                      mvt.idPointVente = el != null ? el.idPointVente : "";
                      mvt.idProduit = el != null ? el.idProduit : "";
                      mvt.stockReel = el != null ? el.stockReel : "";
                      mvt.produit = el != null ? el.produit : "";
                      mvt.mvts = [];
                      el.mvts.forEach((element) => {
                        mvt.mvts.push(element);
                      });
                      this.mvtplus.push(mvt);
                    });
                  } else {
                    this.mvts = [];
                    this.mvtplus = [];
                    this.mvtsSortant = [];
                    this.mvtmoin = [];
                  }
                },
                (errer) => {
                  this.loading = false;
                  this.mvts = [];
                  this.mvtplus = [];
                  this.mvtsSortant = [];
                  this.mvtmoin = [];
                }
              );

            this._MvtStockEndPointService
              .findAllMctByIdPointVente(localStorage.getItem("pointventeid"))
              .subscribe(
                (pv) => {
                  this.loading = false;
                  if (pv.result == 1) {
                    this.mvtsSortant = pv.objectResponse;

                    this.mvtsSortant = this.mvtsSortant.filter((el) => {
                      let mvtlength: number = el.mvts.length;
                      el.mvts = el.mvts.filter((val) => val.sens == "-");
                      if (mvtlength == el.mvts.length || mvtlength != 0) {
                        if (el.mvts.length != 0) {
                          return true;
                        }
                        return false;
                      } else {
                        return false;
                      }
                    });
                    this.mvtmoin = [];
                    this.mvtsSortant.forEach((el) => {
                      let mvt: MvtDto = new MvtDto();
                      mvt.idPointVente = el != null ? el.idPointVente : "";
                      mvt.idProduit = el != null ? el.idProduit : "";
                      mvt.stockReel = el != null ? el.stockReel : "";
                      mvt.produit = el != null ? el.produit : "";
                      mvt.mvts = [];
                      el.mvts.forEach((element) => {
                        mvt.mvts.push(element);
                      });
                      this.mvtmoin.push(mvt);
                    });
                  } else {
                    this.mvts = [];
                    this.mvtplus = [];
                    this.mvtsSortant = [];
                    this.mvtmoin = [];
                  }
                },
                (errer) => {
                  this.loading = false;
                  this.mvts = [];
                  this.mvtplus = [];
                  this.mvtsSortant = [];
                  this.mvtmoin = [];
                }
              );
          }
        }
      });
    let clientdto: ClientDto = new ClientDto();
    clientdto.idpartenaire = this.bpPartnerId;
    clientdto.src = "app-mobile";
    this._ClientAnalyticsEndPointService
      .GetAllClientMobile(clientdto)
      .subscribe((nbrclient) => {
        this.nbrclientmobile =
          nbrclient.objectResponse != null ? nbrclient.objectResponse : 0;
      });
    this.getnewclient(clientdto);
  }

  sessions: any[] = [];
  loading: boolean = true;
  GetSessionByDateAndIdPv(startdate, enddate) {
    if (enddate != null) {
      this._SessionEndPointService
        .GetSessionByDateAndIdPv(
          this.pointVenteId,
          this.datePipe.transform(startdate, "yyyy-MM-dd"),
          this.datePipe.transform(enddate, "yyyy-MM-dd")
        )
        .subscribe((res) => {
          this.loading = false;
          this.sessions = res.objectResponse != null ? res.objectResponse : [];
        });
    } else {
      this._SessionEndPointService
        .GetSessionByDateAndIdPv(
          this.pointVenteId,
          this.datePipe.transform(startdate, "yyyy-MM-dd"),
          null
        )
        .subscribe((res) => {
          this.loading = false;
          this.sessions = res.objectResponse != null ? res.objectResponse : [];
        });
    }
  }
  getnewclient(clientdto: ClientDto) {
    this._ClientAnalyticsEndPointService
      .GetNewClient(clientdto)
      .subscribe((nbrclient) => {
        this.nbrnewclient =
          nbrclient.objectResponse != null ? nbrclient.objectResponse : 0;
      });
    this._ClientAnalyticsEndPointService
      .GetNewClientMobile(clientdto)
      .subscribe((nbrclient) => {
        this.nbrnewclientmobile =
          nbrclient.objectResponse != null ? nbrclient.objectResponse : 0;
      });
  }

  getAnnuledCommande() {
    this._CommandeEndPointService
      .findAllByIdPointVenteandType(this.pointVenteId, 1, 1)
      .subscribe((res) => {
        if (res.result == 1) {
          this.nbrCommandeAnnuler = res.objectResponse.length;
          res.objectResponse.forEach((el) => {
            this.amountCommandeAnnuler =
              this.amountCommandeAnnuler + el.montant;
          });
        } else {
          this.nbrCommandeAnnuler = 0;
        }
      });
  }
  getAnnuledCommandeBetweenStartDateAndEndDate(start, end) {
    this.amountCommandeAnnuler = 0;
    this.nbrCommandeAnnuler = 0;
    this._CommandeEndPointService
      .findAllByIdPointVenteandTypeBetween(this.pointVenteId, 1, 1, start, end)
      .subscribe((res) => {
        if (res.result == 1) {
          this.nbrCommandeAnnuler = res.objectResponse.length;
          res.objectResponse.forEach((el) => {
            this.amountCommandeAnnuler =
              this.amountCommandeAnnuler + el.montant;
          });
        } else {
          this.amountCommandeAnnuler = 0;
          this.nbrCommandeAnnuler = 0;
        }
      });
  }

  toDisplay() {
    if (this.choise == "J") {
      return "Journée " /*+ this.today2.toDateString()*/;
    } else if (this.choise == "M") {
      return "Par Mois";
    } else if (this.choise == "S") {
      return "Cette Semaine";
    } else if (this.choise == "P") {
      return "Par Période";
    }
  }
  toDisplay2() {
    if (this.choise == "J") {
      // this.journeeChart();
      this.loadWithDate();
      return "Journée " + this.today.toDateString();
    } else if (this.choise == "M") {
      var date = new Date();
      this.mondayOfWeek = new Date(date.getFullYear(), date.getMonth(), 1);
      this.sundayOfWeek = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      this.period();
      return "Par Mois";
    } else if (this.choise == "S") {
      this.weekChart();
      return "Cette Semaine";
    } else if (this.choise == "P") {
      this.period();
      return "Par Période";
    }
  }
  addData(labels, data, label) {
    // this.data.labels=labels;
    // this.data.datasets[0].data=data;
    // this.data.datasets[0].label=label;
    this.datas = data;
    this.labels = labels;
    this.label = label;
  }

  removeData(chart) {
    chart.data.labels.pop();
    chart.data.datasets.forEach((dataset) => {
      dataset.data.pop();
    });
    chart.update();
  }

  toggleView() {
    this.flipped = !this.flipped;
  }
  toggleView2() {
    this.flipped2 = !this.flipped2;
  }

  loadWithDate() {
    this.today2 = this.today;
    this.journeeChart();
    this.getAnnuledCommandeBetweenStartDateAndEndDate(
      this.datePipe.transform(this.today2, "yyyy-MM-dd"),
      this.datePipe.transform(this.today2, "yyyy-MM-dd")
    );
    this.getproductbydate(this.today2, null);
    this.getlistdepenses(this.today2, null);
    this.getpackbydate(this.today2, null);
    this.getListCAEmployeByPVAndDate(this.today2, null);
    this.GetSessionByDateAndIdPv(this.today2, null);
    let clientdto: ClientDto = new ClientDto();
    clientdto.idpartenaire = this.bpPartnerId;
    clientdto.src = "app-mobile";
    clientdto.startdate = new Date(
      this.datePipe.transform(this.today, "yyyy-MM-dd")
    );
    clientdto.enddate = new Date(
      this.datePipe.transform(this.today, "yyyy-MM-dd")
    );
    this.getnewclient(clientdto);
    this._PartnerAnalyticsEndPoint
      .getNbrNewClientForPeriode(
        this.pointVenteId,
        this.bpPartnerId,
        this.datePipe.transform(this.today, "yyyy-MM-dd"),
        this.datePipe.transform(this.today, "yyyy-MM-dd")
      )
      .subscribe((res) => {
        if (res.result == 1) {
          this.newClient = res.objectResponse;
        }
      });
    this._PartnerAnalyticsEndPoint
      .getNbrClientPassageByPeriodeAndPartnerAndPV(
        this.pointVenteId,
        this.bpPartnerId,
        this.datePipe.transform(this.today, "yyyy-MM-dd"),
        this.datePipe.transform(this.today, "yyyy-MM-dd")
      )
      .subscribe((res) => {
        if (res.result == 1) {
          this.clientPassage = res.objectResponse;
        }
      });
    if (this.pointVenteId != null) {
      this._PartnerAnalyticsEndPoint
        .getCAByDay(
          this.pointVenteId,
          null,
          this.datePipe.transform(this.today, "yyyy-MM-dd")
        )
        .subscribe((res) => {
          if (res.result == 1) {
            this.todayCA = res.objectResponse.ca;
          }
          this._PartnerAnalyticsEndPoint
            .getNbrTicket(
              this.pointVenteId,
              this.datePipe.transform(this.today, "yyyy-MM-dd"),
              null
            )
            .subscribe((res) => {
              if (res.result == 1) {
                this.nbrTicket = res.objectResponse;
                this.panierMoy = this.todayCA / this.nbrTicket;
              }
            });
        });
    } else {
      this._PartnerAnalyticsEndPoint
        .getCAByDayByPartner(
          this.bpPartnerId,
          this.datePipe.transform(this.today, "yyyy-MM-dd")
        )
        .subscribe((res) => {
          if (res.result == 1) {
            this.todayCA = res.objectResponse[0].CA;
          }
          this._PartnerAnalyticsEndPoint
            .getNbrTicket(
              null,
              this.datePipe.transform(this.today, "yyyy-MM-dd"),
              this.bpPartnerId
            )
            .subscribe((res) => {
              if (res.result == 1) {
                this.nbrTicket = res.objectResponse;
                this.panierMoy = this.todayCA / this.nbrTicket;
              }
            });
        });
    }

    this._PartnerAnalyticsEndPoint
      .getNbrNewClientForDay(
        this.pointVenteId,
        this.bpPartnerId,
        this.datePipe.transform(this.today, "yyyy-MM-dd")
      )
      .subscribe((res) => {
        if (res.result == 1) {
          this.newClient = res.objectResponse;
        }
      });
    this._PartnerAnalyticsEndPoint
      .getNbrClientPassageForDayByPartnerAndPV(
        this.pointVenteId,
        this.bpPartnerId,
        this.datePipe.transform(this.today, "yyyy-MM-dd")
      )
      .subscribe((res) => {
        if (res.result == 1) {
          this.clientPassage = res.objectResponse;
        }
      });
  }

  nbrProduct: number = 0;
  nbrcategorie: number = 0;
  nbrgroupes: number = 0;
  nbraction: number = 0;
  getAllProduct() {
    this._ProductEndPointService
      .findAllByPartenairewithcategorie(localStorage.getItem("partenaireid"))
      .subscribe((val) => {
        if (val.result == 1) {
          this.loading = false;
          this.nbrProduct = val.objectResponse.length;
        } else {
          this.nbrProduct = 0;
        }
      });
  }

  getAllCategorie() {
    this._CategorieEndPointService
      .findAllCategArticlewithchildByIdpartenaire(
        localStorage.getItem("partenaireid")
      )
      .subscribe((val1) => {
        this.nbrcategorie = val1.objectResponse.length;
      });
  }

  getAllGroupeClient() {
    this._GroupeClientPartenaireEndPointService
      .findAllByIdPartenaireOrderByDateCreationDesc(
        localStorage.getItem("partenaireid")
      )
      .subscribe((val) => {
        if (val.result == 1) {
          this.nbrgroupes = val.objectResponse.length;
        } else {
          this.nbrgroupes = 0;
        }
      });
  }

  getAllReglefid() {
    this._ReglesFideliteProduitEndPointService
      .findAllReglesFideliteProduitByIdPartenaire(
        localStorage.getItem("partenaireid")
      )
      .subscribe((pv) => {
        if (pv.result == 1) {
          this.nbraction = pv.objectResponse.length;
        } else {
          this.nbraction = 0;
        }
      });
  }

  getCAByDayandgetNbrTicket(startdate, enddate) {
    if (enddate != null) {
      this._PartnerAnalyticsEndPoint
        .getCAByDay(
          this.pointVenteId,
          null,
          this.datePipe.transform(startdate, "yyyy-MM-dd"),
          this.datePipe.transform(enddate, "yyyy-MM-dd")
        )
        .subscribe((res) => {
          if (res.result == 1) {
            this.todayCA = res.objectResponse.ca;
          }
          this._PartnerAnalyticsEndPoint
            .getNbrTicket(
              this.pointVenteId,
              this.datePipe.transform(startdate, "yyyy-MM-dd"),
              null,
              this.datePipe.transform(enddate, "yyyy-MM-dd")
            )
            .subscribe((res) => {
              if (res.result == 1) {
                this.nbrTicket = res.objectResponse;
                this.panierMoy = this.todayCA / this.nbrTicket;
              }
            });
        });
    } else {
      this._PartnerAnalyticsEndPoint
        .getCAByDay(
          this.pointVenteId,
          null,
          this.datePipe.transform(this.today, "yyyy-MM-dd")
        )
        .subscribe((res) => {
          if (res.result == 1) {
            this.todayCA = res.objectResponse.ca;
          }
          this._PartnerAnalyticsEndPoint
            .getNbrTicket(
              this.pointVenteId,
              this.datePipe.transform(this.today, "yyyy-MM-dd"),
              null
            )
            .subscribe((res) => {
              if (res.result == 1) {
                this.nbrTicket = res.objectResponse;
                this.panierMoy = this.todayCA / this.nbrTicket;
              }
            });
        });
    }
  }
  monthChart() {
    if (this.pointVenteId != null) {
      var currentyear = new Date().getFullYear().toString();
      this._PartnerAnalyticsEndPoint
        .getListEvolCAByMonth(this.pointVenteId, currentyear)
        .subscribe((res) => {
          if (res.result == 1) {
            // res.objectResponse.forEach(element => {
            //    element.mvts.sort((data1, data2) => {
            //      return new Date(data2.dateMvt).getTime() -new Date(data1.dateMvt).getTime()
            //   });

            //  });
            this.themeSubscription = this.theme
              .getJsTheme()
              .subscribe((config) => {
                const colors: any = config.variables;
                const chartjs: any = config.variables.chartjs;

                this.data = {
                  labels: res.objectResponse.months,
                  datasets: [
                    {
                      data: res.objectResponse.ca,
                      label: "CA",
                      backgroundColor: NbColorHelper.hexToRgbA(
                        colors.info,
                        0.3
                      ),
                      borderColor: colors.info,
                    },
                  ],
                };

                this.options = {
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    xAxes: [
                      {
                        gridLines: {
                          display: true,
                          color: chartjs.axisLineColor,
                        },
                        ticks: {
                          fontColor: chartjs.textColor,
                        },
                      },
                    ],
                    yAxes: [
                      {
                        gridLines: {
                          display: true,
                          color: chartjs.axisLineColor,
                        },
                        ticks: {
                          fontColor: chartjs.textColor,
                          beginAtZero: true,
                        },
                      },
                    ],
                  },
                  legend: {
                    labels: {
                      fontColor: chartjs.textColor,
                    },
                  },
                };
              });
          }
        });
    } else {
      var currentyear = new Date().getFullYear().toString();

      this._PartnerAnalyticsEndPoint
        .getListEvolCAByMonthByPartner(this.bpPartnerId, currentyear)
        .subscribe((res) => {
          if (res.result == 1) {
            this.themeSubscription = this.theme
              .getJsTheme()
              .subscribe((config) => {
                const colors: any = config.variables;
                const chartjs: any = config.variables.chartjs;

                this.data = {
                  labels: res.objectResponse.months,
                  datasets: [
                    {
                      data: res.objectResponse.ca,
                      label: "CA",
                      backgroundColor: NbColorHelper.hexToRgbA(
                        colors.info,
                        0.3
                      ),
                      borderColor: colors.info,
                    },
                  ],
                };

                this.options = {
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    xAxes: [
                      {
                        gridLines: {
                          display: true,
                          color: chartjs.axisLineColor,
                        },
                        ticks: {
                          fontColor: chartjs.textColor,
                        },
                      },
                    ],
                    yAxes: [
                      {
                        gridLines: {
                          display: true,
                          color: chartjs.axisLineColor,
                        },
                        ticks: {
                          fontColor: chartjs.textColor,
                          beginAtZero: true,
                        },
                      },
                    ],
                  },
                  legend: {
                    labels: {
                      fontColor: chartjs.textColor,
                    },
                  },
                };
              });
          }
        });
    }
  }
  getproductbydate(date, datefin: string) {
    this._PartnerAnalyticsEndPoint
      .getProductCAByPv(
        this.pointVenteId,
        this.datePipe.transform(date, "yyyy-MM-dd"),
        datefin
      )
      .subscribe((res) => {
        this.listproducts = res.result == 1 ? res.objectResponse : [];
        this.themeSubscription = this.theme.getJsTheme().subscribe((config) => {
          const colors: any = config.variables;
          const chartjs: any = config.variables.chartjs;
          let libelle: any[] = [];
          let data: any[] = [];
          this.listproducts.forEach((el) => {
            libelle.push(el.designation);
            data.push(el.cA);
          });
          this.pieProductdata = {
            labels: libelle,
            datasets: [
              {
                data: data,
                backgroundColor: [
                  colors.primaryLight,
                  colors.infoLight,
                  colors.successLight,
                  colors.danger,
                  "#FF00FF",
                  "#FFFF00",
                  "#00FFFF",
                  "#FF0000",
                  "#800000",
                  "#808000 ",
                  "#008000",
                  "#800080",
                  "#008080",
                  "#000080",
                  "#CD853F ",
                  "#F4A460 ",
                  "#FF1493",
                  "#D2691E ",
                  "#C71585 ",
                  "#DB7093 ",
                  "#DEB887",
                  "#FF00FF",
                  "#FFFF00",
                  "#00FFFF",
                  "#FF0000",
                  "#800000",
                  "#808000 ",
                  "#008000",
                  "#800080",
                  "#008080",
                  "#000080",
                  "#CD853F ",
                  "#F4A460 ",
                  "#FF1493",
                  "#D2691E ",
                  "#C71585 ",
                  "#DB7093 ",
                  "#DEB887",
                  "#FF00FF",
                  "#FFFF00",
                  "#00FFFF",
                  "#FF0000",
                  "#800000",
                  "#808000 ",
                  "#008000",
                  "#800080",
                  "#008080",
                  "#000080",
                  "#CD853F ",
                  "#F4A460 ",
                  "#FF1493",
                  "#D2691E ",
                  "#C71585 ",
                  "#DB7093 ",
                  "#DEB887",
                ],
              },
            ],
          };

          this.optionspie = {
            maintainAspectRatio: false,
            responsive: true,
            scales: {
              xAxes: [
                {
                  display: false,
                },
              ],
              yAxes: [
                {
                  display: false,
                },
              ],
            },
            legend: {
              labels: {
                fontColor: chartjs.textColor,
              },
            },
          };
        });
      });
  }
  getpackbydate(date, datefin: string) {
    this._PartnerAnalyticsEndPoint
      .getListCAPacktByPVAndDate(
        this.pointVenteId,
        this.datePipe.transform(date, "yyyy-MM-dd"),
        datefin
      )
      .subscribe((res) => {
        this.listpacks = res.result == 1 ? res.objectResponse : [];
        this.themeSubscription = this.theme.getJsTheme().subscribe((config) => {
          const colors: any = config.variables;
          const chartjs: any = config.variables.chartjs;
          let libelle: any[] = [];
          let data: any[] = [];
          this.listpacks.forEach((el) => {
            if (el.idProduit != null) {
              libelle.push(el.designation);
              data.push(el.cA);
            }
          });

          this.piePackdata = {
            labels: libelle,
            datasets: [
              {
                data: data,
                backgroundColor: [
                  colors.primaryLight,
                  colors.infoLight,
                  colors.successLight,
                  colors.danger,
                  "#FF00FF",
                  "#FFFF00",
                  "#00FFFF",
                  "#FF0000",
                  "#800000",
                  "#808000 ",
                  "#008000",
                  "#800080",
                  "#008080",
                  "#000080",
                  "#CD853F ",
                  "#F4A460 ",
                  "#FF1493",
                  "#D2691E ",
                  "#C71585 ",
                  "#DB7093 ",
                  "#DEB887",
                  "#FF00FF",
                  "#FFFF00",
                  "#00FFFF",
                  "#FF0000",
                  "#800000",
                  "#808000 ",
                  "#008000",
                  "#800080",
                  "#008080",
                  "#000080",
                  "#CD853F ",
                  "#F4A460 ",
                  "#FF1493",
                  "#D2691E ",
                  "#C71585 ",
                  "#DB7093 ",
                  "#DEB887",
                  "#FF00FF",
                  "#FFFF00",
                  "#00FFFF",
                  "#FF0000",
                  "#800000",
                  "#808000 ",
                  "#008000",
                  "#800080",
                  "#008080",
                  "#000080",
                  "#CD853F ",
                  "#F4A460 ",
                  "#FF1493",
                  "#D2691E ",
                  "#C71585 ",
                  "#DB7093 ",
                  "#DEB887",
                  "#FF00FF",
                  "#FFFF00",
                  "#00FFFF",
                  "#FF0000",
                  "#800000",
                  "#808000 ",
                  "#008000",
                  "#800080",
                  "#008080",
                  "#000080",
                  "#CD853F ",
                  "#F4A460 ",
                  "#FF1493",
                  "#D2691E ",
                  "#C71585 ",
                  "#DB7093 ",
                  "#DEB887",
                  "#FF00FF",
                  "#FFFF00",
                  "#00FFFF",
                  "#FF0000",
                  "#800000",
                  "#808000 ",
                  "#008000",
                  "#800080",
                  "#008080",
                  "#000080",
                  "#CD853F ",
                  "#F4A460 ",
                  "#FF1493",
                  "#D2691E ",
                  "#C71585 ",
                  "#DB7093 ",
                  "#DEB887",
                ],
              },
            ],
          };
        });
      });
  }
  journeeChart() {
    if (this.pointVenteId != null) {
      this._PartnerAnalyticsEndPoint
        .getListEvolCAInDay(
          this.pointVenteId,
          this.datePipe.transform(this.today2, "yyyy-MM-dd")
        )
        .subscribe((res) => {
          if (res.result == 1) {
            this.themeSubscription = this.theme
              .getJsTheme()
              .subscribe((config) => {
                const colors: any = config.variables;
                const chartjs: any = config.variables.chartjs;

                this.data = {
                  labels: res.objectResponse.hours,
                  datasets: [
                    {
                      data: res.objectResponse.ca,
                      label: "CA",
                      backgroundColor: NbColorHelper.hexToRgbA(
                        colors.info,
                        0.3
                      ),
                      borderColor: colors.info,
                    },
                  ],
                };

                this.options = {
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    xAxes: [
                      {
                        gridLines: {
                          display: true,
                          color: chartjs.axisLineColor,
                        },
                        ticks: {
                          fontColor: chartjs.textColor,
                        },
                      },
                    ],
                    yAxes: [
                      {
                        gridLines: {
                          display: true,
                          color: chartjs.axisLineColor,
                        },
                        ticks: {
                          fontColor: chartjs.textColor,
                          beginAtZero: true,
                        },
                      },
                    ],
                  },
                  legend: {
                    labels: {
                      fontColor: chartjs.textColor,
                    },
                  },
                };
              });
          }
        });
    } else {
      this._PartnerAnalyticsEndPoint
        .getListEvolCAInDayByPartner(
          this.bpPartnerId,
          this.datePipe.transform(this.today2, "yyyy-MM-dd")
        )
        .subscribe((res) => {
          if (res.result == 1) {
            this.themeSubscription = this.theme
              .getJsTheme()
              .subscribe((config) => {
                const colors: any = config.variables;
                const chartjs: any = config.variables.chartjs;

                this.data = {
                  labels: res.objectResponse.hours,
                  datasets: [
                    {
                      data: res.objectResponse.ca,
                      label: "CA",
                      backgroundColor: NbColorHelper.hexToRgbA(
                        colors.info,
                        0.3
                      ),
                      borderColor: colors.info,
                    },
                  ],
                };

                this.options = {
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    xAxes: [
                      {
                        gridLines: {
                          display: true,
                          color: chartjs.axisLineColor,
                        },
                        ticks: {
                          fontColor: chartjs.textColor,
                        },
                      },
                    ],
                    yAxes: [
                      {
                        gridLines: {
                          display: true,
                          color: chartjs.axisLineColor,
                        },
                        ticks: {
                          fontColor: chartjs.textColor,
                          beginAtZero: true,
                        },
                      },
                    ],
                  },
                  legend: {
                    labels: {
                      fontColor: chartjs.textColor,
                    },
                  },
                };
              });
          }
        });
    }
  }
  weekChart() {
    this.themeSubscription = this.theme.getJsTheme().subscribe((config) => {
      const colors: any = config.variables;
      const chartjs: any = config.variables.chartjs;

      this.data = {
        labels: [
          "Dimanche",
          "Lundi",
          "Mardi",
          "Mercredi",
          "Jeudi",
          "Vendredi",
          "Samedi",
        ],
        datasets: [
          {
            data: [65, 59, 80, 81, 56, 55, 40],
            label: "CA",
            backgroundColor: NbColorHelper.hexToRgbA(colors.info, 0.3),
            borderColor: colors.info,
          },
        ],
      };

      this.options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [
            {
              gridLines: {
                display: true,
                color: chartjs.axisLineColor,
              },
              ticks: {
                fontColor: chartjs.textColor,
              },
            },
          ],
          yAxes: [
            {
              gridLines: {
                display: true,
                color: chartjs.axisLineColor,
              },
              ticks: {
                fontColor: chartjs.textColor,
                beginAtZero: true,
              },
            },
          ],
        },
        legend: {
          labels: {
            fontColor: chartjs.textColor,
          },
        },
      };
    });
  }
  period() {
    if (this.pointVenteId != null) {
      let clientdto: ClientDto = new ClientDto();
      clientdto.idpartenaire = this.bpPartnerId;
      clientdto.src = "app-mobile";
      clientdto.startdate = new Date(
        this.datePipe.transform(this.mondayOfWeek, "yyyy-MM-dd")
      );
      clientdto.enddate = new Date(
        this.datePipe.transform(this.sundayOfWeek, "yyyy-MM-dd")
      );
      this.getCAByDayandgetNbrTicket(this.mondayOfWeek, this.sundayOfWeek);
      this.getAnnuledCommandeBetweenStartDateAndEndDate(
        this.datePipe.transform(this.mondayOfWeek, "yyyy-MM-dd"),
        this.datePipe.transform(this.sundayOfWeek, "yyyy-MM-dd")
      );
      this.getlistdepenses(this.mondayOfWeek, this.sundayOfWeek);
      this.GetSessionByDateAndIdPv(this.mondayOfWeek, this.sundayOfWeek);
      this.getproductbydate(
        this.mondayOfWeek,
        this.datePipe.transform(this.sundayOfWeek, "yyyy-MM-dd")
      );
      this.getpackbydate(
        this.mondayOfWeek,
        this.datePipe.transform(this.sundayOfWeek, "yyyy-MM-dd")
      );
      this.getListCAEmployeByPVAndDate(
        this.mondayOfWeek,
        this.datePipe.transform(this.sundayOfWeek, "yyyy-MM-dd")
      );
      this.getnewclient(clientdto);
      this._PartnerAnalyticsEndPoint
        .getNbrNewClientForPeriode(
          this.pointVenteId,
          this.bpPartnerId,
          this.datePipe.transform(this.mondayOfWeek, "yyyy-MM-dd"),
          this.datePipe.transform(this.sundayOfWeek, "yyyy-MM-dd")
        )
        .subscribe((res) => {
          if (res.result == 1) {
            this.newClient = res.objectResponse;
          }
        });
      this._PartnerAnalyticsEndPoint
        .getNbrClientPassageByPeriodeAndPartnerAndPV(
          this.pointVenteId,
          this.bpPartnerId,
          this.datePipe.transform(this.mondayOfWeek, "yyyy-MM-dd"),
          this.datePipe.transform(this.sundayOfWeek, "yyyy-MM-dd")
        )
        .subscribe((res) => {
          if (res.result == 1) {
            this.clientPassage = res.objectResponse;
          }
        });
      this._PartnerAnalyticsEndPoint
        .getListEvolCAByPeriode(
          this.pointVenteId,
          this.datePipe.transform(this.mondayOfWeek, "yyyy-MM-dd"),
          this.datePipe.transform(this.sundayOfWeek, "yyyy-MM-dd")
        )
        .subscribe((res) => {
          if (res.result == 1) {
            var days = [];
            var CA = [];
            res.objectResponse
              .sort((data1, data2) => {
                return (
                  new Date(data1._id).getTime() - new Date(data2._id).getTime()
                );
              })
              .forEach((value) => {
                days.push(value._id);
                CA.push(value.CA);
              });
            this.themeSubscription = this.theme
              .getJsTheme()
              .subscribe((config) => {
                const colors: any = config.variables;
                const chartjs: any = config.variables.chartjs;

                this.data = {
                  labels: days,
                  datasets: [
                    {
                      data: CA,
                      label: "CA",
                      backgroundColor: NbColorHelper.hexToRgbA(
                        colors.info,
                        0.3
                      ),
                      borderColor: colors.info,
                    },
                  ],
                };

                this.options = {
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    xAxes: [
                      {
                        gridLines: {
                          display: true,
                          color: chartjs.axisLineColor,
                        },
                        ticks: {
                          fontColor: chartjs.textColor,
                        },
                      },
                    ],
                    yAxes: [
                      {
                        gridLines: {
                          display: true,
                          color: chartjs.axisLineColor,
                        },
                        ticks: {
                          fontColor: chartjs.textColor,
                          beginAtZero: true,
                        },
                      },
                    ],
                  },
                  legend: {
                    labels: {
                      fontColor: chartjs.textColor,
                    },
                  },
                };
              });
          }
        });
    } else {
      this._PartnerAnalyticsEndPoint
        .getListEvolCAByPeriodeByPartner(
          this.bpPartnerId,
          this.datePipe.transform(this.mondayOfWeek, "yyyy-MM-dd"),
          this.datePipe.transform(this.sundayOfWeek, "yyyy-MM-dd")
        )
        .subscribe((res) => {
          if (res.result == 1) {
            var days = [];
            var CA = [];
            res.objectResponse
              .sort((data1, data2) => {
                return (
                  new Date(data1._id).getTime() - new Date(data2._id).getTime()
                );
              })
              .forEach((value) => {
                days.push(value._id);
                CA.push(value.CA);
              });
            // res.objectResponse.forEach(value => {days.push(value._id) ;CA.push(value.CA)});
            this.themeSubscription = this.theme
              .getJsTheme()
              .subscribe((config) => {
                const colors: any = config.variables;
                const chartjs: any = config.variables.chartjs;

                this.data = {
                  labels: days,
                  datasets: [
                    {
                      data: CA,
                      label: "CA",
                      backgroundColor: NbColorHelper.hexToRgbA(
                        colors.info,
                        0.3
                      ),
                      borderColor: colors.info,
                    },
                  ],
                };

                this.options = {
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    xAxes: [
                      {
                        gridLines: {
                          display: true,
                          color: chartjs.axisLineColor,
                        },
                        ticks: {
                          fontColor: chartjs.textColor,
                        },
                      },
                    ],
                    yAxes: [
                      {
                        gridLines: {
                          display: true,
                          color: chartjs.axisLineColor,
                        },
                        ticks: {
                          fontColor: chartjs.textColor,
                          beginAtZero: true,
                        },
                      },
                    ],
                  },
                  legend: {
                    labels: {
                      fontColor: chartjs.textColor,
                    },
                  },
                };
              });
          }
        });
    }
  }
  ngOnDestroy(): void {
    if (this.themeSubscription != null) this.themeSubscription.unsubscribe();
  }

  getListCAEmployeByPVAndDate(date, datefin) {
    this._PartnerAnalyticsEndPoint
      .getListCAEmployeByPVAndDate(
        this.pointVenteId,
        this.datePipe.transform(date, "yyyy-MM-dd"),
        datefin
      )
      .subscribe((val) => {
        this.listemplyes = val.objectResponse != null ? val.objectResponse : [];
      });
  }

  changetab(event) {
    if (event.tabTitle == "CA par produit") {
      this.afficheproduit = true;
    } else {
      this.afficheproduit = false;
    }
  }

  depenses: any[] = [];
  typeoperation: any[] = [];
  gettypedpense() {
    this._OperationTypeEndPointService
      .findAllOperationType()
      .subscribe((res) => {
        this.typeoperation =
          res.objectResponse != null ? res.objectResponse : [];
      });
  }
  getlistdepenses(startdate, enddate) {
    this._PartnerAnalyticsEndPoint
      .getListCAdepanceByPVAndDate(
        this.pointVenteId,
        this.datePipe.transform(startdate, "yyyy-MM-dd"),
        this.datePipe.transform(enddate, "yyyy-MM-dd")
      )
      .subscribe((res) => {
        this.depenses = res.objectResponse != null ? res.objectResponse : [];
        this.depanceDtos = [];
        this.typeoperation.forEach((el) => {
          let depances: any[] = this.depenses.filter(
            (de) => de.operationType[0].designation == el.designation
          );
          if (depances.length > 0) {
            let dep: DepanceDto = new DepanceDto();
            dep.depance = depances;
            dep.operationType = el;
            this.depanceDtos.push(dep);
          }
        });
      });
  }

  @ViewChild("bar1", { static: false }) bar1: ElementRef;
  canvas: any;

  exporttoPdf(id, filename, secondname?, rows?, type?) {
    var position = 55;
    let pdf = new jspdf.jsPDF("p", "mm", "a4"); // A4 size page of PDF
if(this.choise=='P'){
pdf.text('Du : '+new DatePipe("en").transform(this.mondayOfWeek, "dd/MM/yyyy"), 162, 23);
pdf.text('A :  '+new DatePipe("en").transform(this.sundayOfWeek, "dd/MM/yyyy"), 162, 30);

}
    else
    pdf.text(new DatePipe("en").transform(this.today, "dd/MM/yyyy"), 165, 23);

    pdf.setLineWidth(0.5);
    pdf.rect(10, 10, 40, 30);
    pdf.rect(50, 10, 110, 30);
    pdf.rect(160, 10, 40, 30);
    pdf.text('Pointe de vente : \n'+this.pointVente.designation, 15, 25);
    pdf.text(filename, type == "depance" ? 80 : 60, 23);
    if (secondname != null) pdf.text(secondname, 60, 30);

    if (type != null) {
      if (type == "depance") {
        let table: any[] = [];
        var columns = ["Type Dépense", "Employé", "Date Opération", "Montant"];
        rows.forEach((element) => {
          element.depance.forEach((subElement) => {
            table.push([
              element.operationType.designation,
              subElement.user != null
                ? subElement.user.nom
                : null + " " + subElement.user != null
                  ? subElement.user.prenom
                  : null,
              new DatePipe("en").transform(
                new Date(subElement.dateOperation),
                "dd/MM/yyyy"
              ),
              subElement.montant,
            ]);
          });
        });
        autoTable(pdf, { body: table, head: [columns], startY: 50 });
      } else {
        let Total = 0;
        let table: any[] = [];
        rows.forEach((element) => {
          Total +=element.cA;
          table.push([element.designation, element.nbr, element.cA]);
        });
        table.push(['',,Total]);
        
        
        

        if (type == "pack") {
          var columns = ["Pack", "Quantité", "Chiffre d'affaire"];
        } else if (type == "produit") {
          var columns = ["Pack", "Quantité", "Chiffre d'affaire"];
        }
        autoTable(pdf, 
          { 
            body: table, head: [columns], startY: 50,
            didParseCell: function (data) {
              var rows = data.table.body;
              if (data.row.index === rows.length - 1) {
                  data.cell.styles.fillColor = [239, 154, 154];
              }
          }
          
        
        
        });
      }

      pdf.save(filename + ".pdf");
    } else {
      pdf.setDrawColor(0);
      pdf.setFillColor(255, 255, 255);
      pdf.roundedRect(5, 50, 200, 126, 3, 3, "FD");
      html2canvas.default(document.querySelector(id)).then((canvas) => {
        this.canvas = document.body.appendChild(canvas);
        pdf.addImage(
          this.canvas.toDataURL("image/png"),
          "PNG",
          15,
          position,
          180,
          116
        );
        setTimeout(() => {
          pdf.save(filename + ".pdf");
        }, 0);
      });
    }
  }

  diplaySession: boolean = false;
  currentSession: any
  fermerSession() {
    this._SessionEndPointService.closeSession(this.currentSession._sessionId).subscribe(val => {
      this.diplaySession = false
      this.currentSession.fFerme = 1;
    })
  }
}
