import { Component, OnInit } from "@angular/core";
import { ZoneEndPointService } from "../../../../service/bp-api-pos/zone-end-point/zone-end-point.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { GlobalServiceService } from "../../../../service/GlobalService/global-service.service";
import { UtilisateurEndPointService } from "../../../../service/bp-api-admin/utilisateur-end-point/utilisateur-end-point.service";
import { TableCaisseEndPointService } from "../../../../service/bp-api-pos/table-caisse-end-point/table-caisse-end-point.service";
import { PointVente } from "../../../../model/PointVente";
import { Utilisateur } from "../../../../model/Utilisateur";
import { TableCaisse } from "../../../../model/TableCaisse";
import { forkJoin } from "rxjs";

@Component({
  selector: "ngx-update-zone",
  templateUrl: "./update-zone.component.html",
  styleUrls: ["./update-zone.component.scss"],
})
export class UpdateZoneComponent implements OnInit {
  constructor(
    private _ZoneEndPointService: ZoneEndPointService,
    private _FormBuilder: FormBuilder,
    private router: Router,
    private _GlobalServiceService: GlobalServiceService,
    private _UtilisateurEndPointService: UtilisateurEndPointService,
    private _TableCaisseEndPointService: TableCaisseEndPointService,
    private route: ActivatedRoute
  ) {}

  zoneForm: FormGroup;
  points: PointVente[] = [];
  employees: Utilisateur[] = [];
  tables: TableCaisse[] = [];
  loading: boolean = true;
  isZoneFormSubmitted: boolean = false;
  id: string = this.route.snapshot.paramMap.get("id");

  ngOnInit() {
    this.createForm();
    this.getDate();
  }

  createForm(zone?: any) {
    this.zoneForm = this._FormBuilder.group({
      idPointVente: [localStorage.getItem("pointventeid")],
      name: [zone ? zone.name : null, [Validators.required]],
      idEmployer: [
        zone ? zone.idEmployer : [],
        [Validators.required],
      ],
      tableCaissesIds: [
        zone ? zone.tableCaissesIds : [],
        [Validators.required],
      ],
      idZone: [zone ? zone.idZone : null],
    });
  }

  private getDate(){
    forkJoin(
      this.getTables(),
      this.getEmployees(),
      this.getZoneById()
    ).subscribe((val) => {
      this.tables = val[0].objectResponse != null ? val[0].objectResponse : [];
      this.employees =
        val[1].objectResponse != null ? val[1].objectResponse : [];
      setTimeout(() => {
        this.createForm(val[2].objectResponse);
        this.loading = false;
      }, 0);
    });
  }

  private getTables() {
    return this._TableCaisseEndPointService.findAllByIdPointVente(
      localStorage.getItem("pointventeid")
    );
  }

  private getEmployees() {
    return this._UtilisateurEndPointService.findAllByIdPointVente(
      localStorage.getItem("pointventeid")
    );
  }

  private getZoneById() {
    return this._ZoneEndPointService.findByIdZone(this.id);
  }

  addZone() {
    this.isZoneFormSubmitted = true;
    if (this.zoneForm.invalid) {
      return;
    } else {
      this.loading = true;
      this._ZoneEndPointService.createZone(this.zoneForm.value).subscribe(
        (val) => {
          this.loading = false;
          if (val.result == 1) {
            this.router.navigateByUrl("/pages/Pointvente/gestionZone");
          } else {
            this._GlobalServiceService.showToast(
              "danger",
              "Erreur",
              val.errorDescription
            );
            this.loading = false;
          }
        },
        (erreur) => {
          this._GlobalServiceService.showToast("danger", "Erreur", erreur);
          this.loading = false;
        }
      );
    }
  }
  get formControls() {
    return this.zoneForm.controls;
  }

  returntolist() {
    this.router.navigateByUrl("/pages/Pointvente/gestionZone");
  }
}
