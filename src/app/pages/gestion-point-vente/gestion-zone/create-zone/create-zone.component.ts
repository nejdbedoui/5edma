import { Component, OnInit } from "@angular/core";
import { ZoneEndPointService } from "../../../../service/bp-api-pos/zone-end-point/zone-end-point.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { GlobalServiceService } from "../../../../service/GlobalService/global-service.service";
import { PointVente } from "../../../../model/PointVente";
import { Utilisateur } from "../../../../model/Utilisateur";
import { TableCaisse } from "../../../../model/TableCaisse";
import { UtilisateurEndPointService } from "../../../../service/bp-api-admin/utilisateur-end-point/utilisateur-end-point.service";
import { TableCaisseEndPointService } from "../../../../service/bp-api-pos/table-caisse-end-point/table-caisse-end-point.service";
import { forkJoin } from "rxjs";

@Component({
  selector: "ngx-create-zone",
  templateUrl: "./create-zone.component.html",
  styleUrls: ["./create-zone.component.scss"],
})
export class CreateZoneComponent implements OnInit {
  constructor(
    private _ZoneEndPointService: ZoneEndPointService,
    private _FormBuilder: FormBuilder,
    private router: Router,
    private _GlobalServiceService: GlobalServiceService,
    private _UtilisateurEndPointService: UtilisateurEndPointService,
    private _TableCaisseEndPointService: TableCaisseEndPointService
  ) {}

  zoneForm: FormGroup;
  points: PointVente[] = [];
  employees: Utilisateur[] = [];
  tables: TableCaisse[] = [];
  loading: boolean = false;
  isZoneFormSubmitted: boolean = false;

  ngOnInit() {
    this.createForm();
    forkJoin(this.getTables(), this.getEmployees()).subscribe((val) => {
      this.tables = val[0].objectResponse != null ? val[0].objectResponse : [];
      this.employees =
        val[1].objectResponse != null ? val[1].objectResponse : [];
    });
  }

  createForm() {
    this.zoneForm = this._FormBuilder.group({
      idPointVente: [localStorage.getItem("pointventeid")],
      name: [null, [Validators.required]],
      idEmployer: [[], [Validators.required]],
      tableCaissesIds: [[], [Validators.required]],
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

  addZone() {
    this.isZoneFormSubmitted = true;
    if (this.zoneForm.invalid) {
      return;
    } else {
      this.loading = true;
      this._ZoneEndPointService.createZone(this.zoneForm.value).subscribe(
        (val) => {
          this.loading = false;
          console.log(val);

          if (val.result == 1) {
            this.router.navigateByUrl("/pages/Pointvente/gestionZone");
          } else {
            this._GlobalServiceService.showToast(
              "danger",
              "Erreur",
              val.errorDescription
            );
          }
        },
        (erreur) => {
          this._GlobalServiceService.showToast("danger", "Erreur", erreur);
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
