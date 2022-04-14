import { PartenaireBpriceEndPointService } from './../service/bp-api-pos/partenaire-bprice-end-point/partenaire-bprice-end-point.service';
import { PointVenteEndPointService } from './../service/bp-api-pos/point-vente-end-point/point-vente-end-point.service';
import { Component, OnInit } from '@angular/core';

import { MENU_ITEMS, MENU_ITEMSPar, MENU_ITEMSPARAMETRE, MENU_ITEMSTABLEAU, MENU_ITEMSParWihthoutTable, MENU_ITEMSParWihthoutTableandreservation, MENU_ITEMSParwithoutreservation, MENU_ITEMSCENTRAL, MENU_ITEMSPARAMETREWITHOUTINGREDIENT } from './pages-menu';
import { LocalstorageService } from '../service/GlobalService/Localstorage/localstorage.service';
import { UtilisateurEndPointService } from '../service/bp-api-admin/utilisateur-end-point/utilisateur-end-point.service';
import { Access } from '../model/enum/Access';

@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <ngx-one-column-layout>
      <nb-menu *ngIf="menu" [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
})
export class PagesComponent implements OnInit {
  reservation: {
    title: 'Gestion des Rendez-vous',
    icon: 'calendar-outline',
    link: '/pages/Pointvente/gestionRendezVous',

  }
  constructor(private _LocalstorageService: LocalstorageService,
    private _PointVenteEndPointService: PointVenteEndPointService,
    private _PartenaireBpriceEndPointService: PartenaireBpriceEndPointService,
    private utilisateurEndPointService: UtilisateurEndPointService) { }
  ngOnInit(): void {
    if (localStorage.getItem("partenaireid") != null) {
      if (localStorage.getItem("type") == '0') {
        this.localMenu = MENU_ITEMSTABLEAU;
      } else if (localStorage.getItem("type") == '1') {
        this._PartenaireBpriceEndPointService.findByIdPartenaire(localStorage.getItem("partenaireid")).subscribe(el => {
          if (el.objectResponse.idSector == "5e40324a4bab8b4ca410c5a3") {
            this.localMenu = MENU_ITEMSPARAMETRE;
          } else {
            this.localMenu = MENU_ITEMSPARAMETREWITHOUTINGREDIENT;
          }
          this.getConnectedUser();
        })
      } else {
        this._PointVenteEndPointService.findPointVenteByIdPointVente(localStorage.getItem("pointventeid")).subscribe(el => {
          if (el.objectResponse.typePv == "centraleStock") {
            this.localMenu = MENU_ITEMSCENTRAL;
          } else {
            if (el.objectResponse.fGestionTable != null && el.objectResponse.fGestionTable == 1) {

              if (el.objectResponse.fReservation == '1') {
                this.localMenu = MENU_ITEMSPar;
              } else {
                this.localMenu = MENU_ITEMSParwithoutreservation
              }
            } else {
              if (el.objectResponse.fReservation == '1') {
                this.localMenu = MENU_ITEMSParWihthoutTable
              } else {
                this.localMenu = MENU_ITEMSParWihthoutTableandreservation
              }
              // this.localMenu.push(this.reservation)
            }
          }
          this.getConnectedUser();
        })
        this.localMenu = MENU_ITEMSParWihthoutTable;


      }
    } else {
      this.localMenu = MENU_ITEMS;

    }
    this._LocalstorageService.currentsidebarrole.subscribe(val => {
      if (val != null) {
        if (localStorage.getItem("partenaireid") != null) {
          if (localStorage.getItem("type") == '0') {
            this.localMenu = MENU_ITEMSTABLEAU;
          } else if (localStorage.getItem("type") == '1') {
            this.localMenu = MENU_ITEMSPARAMETRE;
          } else {
            this._PointVenteEndPointService.findPointVenteByIdPointVente(localStorage.getItem("pointventeid")).subscribe(el => {
              if (el.objectResponse.fGestionTable != null && el.objectResponse.fGestionTable == 1) {
                this.localMenu = MENU_ITEMSPar;
              } else {
                this.localMenu = MENU_ITEMSParWihthoutTable
              }
              this.getConnectedUser();
            })
            this.localMenu = MENU_ITEMSParWihthoutTable;
          }
        } else {
          this.localMenu = MENU_ITEMS;

        }
      }
    })


  }


  getConnectedUser() {
    this.utilisateurEndPointService.findUtilisateurByIdUtilisateur(localStorage.getItem("UserId")).subscribe(user => {
      if (user.objectResponse.accessPermissions != null) {

        if (localStorage.getItem("type") == null) {
          let permissionsPv = user.objectResponse.accessPermissions.accessPermissionsPv.find(el => el.pointVente == localStorage.getItem("pointventeid"))
          console.log(permissionsPv);
          this.localMenu = this.localMenu.filter(m => permissionsPv.permissions.find(p => Access[p.functionName.toString()] == m.title && p.checked) != null)
        } else if (localStorage.getItem("type") == '1') {
          let settingPermissions = user.objectResponse.accessPermissions.settingsPermissions
          this.localMenu[0].children = this.localMenu[0].children.filter(m => settingPermissions.find(p => Access[p.functionName.toString()] == m.title && p.checked) != null)
        }
      }

      console.log(this.localMenu);
      this.menu = this.localMenu;
    })
  }

  menu: any
  localMenu: any
}
