import { Component, OnInit } from "@angular/core";
import { Zone } from "../../../model/Zone";
import { Router } from "@angular/router";
import { GlobalServiceService } from "../../../service/GlobalService/global-service.service";
import { ZoneEndPointService } from "../../../service/bp-api-pos/zone-end-point/zone-end-point.service";
import { TableCaisse } from "../../../model/TableCaisse";
import { Utilisateur } from '../../../model/Utilisateur';

@Component({
  selector: "ngx-gestion-zone",
  templateUrl: "./gestion-zone.component.html",
  styleUrls: ["./gestion-zone.component.scss"],
})
export class GestionZoneComponent implements OnInit {
  constructor(
    private route: Router,
    private _ZoneEndPointService: ZoneEndPointService
  ) {}

  zones: Zone[] = [];
  cols: any[];
  loading: boolean = true;
  diplayZone: boolean = false;
  currentZoneId: string;
  ngOnInit() {
    this.getZoneByIdPv();
  }

  editZone(idZone: String) {
    this.route.navigateByUrl(
      `/pages/Pointvente/gestionZone/updateZone/${idZone}`
    );
  }

  deleteZone() {
    this._ZoneEndPointService
      .deleteZone(this.currentZoneId)
      .subscribe((val) => {
        this.zones = this.zones.filter(
          (element) => element.idZone != this.currentZoneId
        );
      });
  }

  addZone() {
    this.route.navigateByUrl("/pages/Pointvente/gestionZone/NouvelleZone");
  }

  getZoneByIdPv() {
    this._ZoneEndPointService
      .findAllByIdPointVente(localStorage.getItem("pointventeid"))
      .subscribe((val) => {
        this.zones = val.objectResponse != null ? val.objectResponse : [];
        this.loading = false;
      });
  }

  mapTableCaisses(tableCaisses: TableCaisse[]) {
    return tableCaisses.map((el) => el.numTable).join(" / ");
  }

  mapUser(user: Utilisateur[]) {
    return user.map((el) => el.nom+' '+el.prenom).join(" / ");
  }
}
