import { Component, OnInit } from '@angular/core';
import { PointVenteEndPointService } from '../../service/bp-api-pos/point-vente-end-point/point-vente-end-point.service';
import { PointVente } from '../../model/PointVente';
import { Router } from '@angular/router';
import { PartenaireBpriceEndPointService } from '../../service/bp-api-pos/partenaire-bprice-end-point/partenaire-bprice-end-point.service';
import { UtilisateurEndPointService } from '../../service/bp-api-admin/utilisateur-end-point/utilisateur-end-point.service';

@Component({
  selector: 'ngx-choosepointvente',
  templateUrl: './choosepointvente.component.html',
  styleUrls: ['./choosepointvente.component.scss']
})
export class ChoosepointventeComponent implements OnInit {


  constructor(private _PointVenteEndPointService: PointVenteEndPointService, private router: Router,
    private _PartenaireBpriceEndPointService: PartenaireBpriceEndPointService, private utilisateurEndPointService: UtilisateurEndPointService) { }

  loading: boolean = false
  pointventes: PointVente[] = []
  pointventesOnly: PointVente[] = []
  stockCentrales: PointVente[] = []
  sortOptions: any[];
  showParam: boolean = true;
  sortKey: string;

  sortField: string;

  sortOrder: number;
  logo: string = null
  ngOnInit() {
    this.sortOptions = [
      { label: 'tri croissant par description', value: '!year' },
      { label: 'tri décroissant par description', value: 'year' }
    ];
    this._PartenaireBpriceEndPointService.findByIdPartenaire(localStorage.getItem("partenaireid")).subscribe(val => {
      console.log(val);
      this.logo = val.objectResponse != null ? val.objectResponse.logo != null ? val.objectResponse.logo : null : null

    })
    this._PointVenteEndPointService.findAllByIdPartenaireBprice(localStorage.getItem("partenaireid")).subscribe(val => {
      if (val.result == 1) {
        this.pointventes = val.objectResponse
        this.utilisateurEndPointService.findUtilisateurByIdUtilisateur(localStorage.getItem("UserId")).subscribe(user => {

          if (user.objectResponse.accessPermissions != null) {

            this.showParam = user.objectResponse.accessPermissions.adminPermission;
            if (user.objectResponse.accessPermissions.adminPermission) {
              this.pointventesOnly = this.pointventes.filter(el => el.typePv != 'centraleStock');
              this.stockCentrales = this.pointventes.filter(el => el.typePv == 'centraleStock');
            } else if (!user.objectResponse.accessPermissions.adminPermission && user.objectResponse.accessPermissions.accessPermissionsPv != null) {
              var arrayFiltred = new Array();

              user.objectResponse.accessPermissions.accessPermissionsPv.forEach(function (value) {

                if (value.permissions.filter(obj => obj.checked == false).length != value.permissions.length) {
                  arrayFiltred.push(value.pointVente)
                }


              });
              var res = this.pointventes.filter(f => arrayFiltred.includes(f.idPointVente));
              if (res != null) {
                this.pointventesOnly = res.filter(el => el.typePv != 'centraleStock');
                this.stockCentrales = res.filter(el => el.typePv == 'centraleStock');
              }
            }
          } else {
            this.pointventesOnly = this.pointventes.filter(el => el.typePv != 'centraleStock');
            this.stockCentrales = this.pointventes.filter(el => el.typePv == 'centraleStock');
          }
        })
      }
    })
  }
  onSortChange(event) {
    let value = event.value;
    if (value.indexOf('!') === 0) {
      this.sortOrder = -1;
      this.sortField = value.substring(1, value.length);
      this.pointventes.sort((a, b) => a.designation.localeCompare(b.designation))
    }
    else {
      this.pointventes.sort((a, b) => - a.designation.localeCompare(b.designation))

      this.sortOrder = 1;
      this.sortField = value;
    }
  }

  choosepointvente(pointvente: PointVente) {
    localStorage.setItem("pointventeid", pointvente.idPointVente)
    this.router.navigateByUrl("/pages/dashboard");
  }

  tableauboard() {
    //type ==0 for dashboard
    localStorage.setItem("type", '0')
    this.router.navigateByUrl("/pages/dashboard");
  }

  param() {
    //type ==1 for parametre
    localStorage.setItem("type", '1')
    this.router.navigateByUrl("/pages/dashboard");
  }
  getcolor(index: number) {
    let val: number = (index + 1) % 3;

    if (val == 0) {
      return "#352C60"
    } else if (val == 1) {
      return "#8066FF"
    } else if (val == 2) {
      return "#CF5FFE"
    }

  }
}
