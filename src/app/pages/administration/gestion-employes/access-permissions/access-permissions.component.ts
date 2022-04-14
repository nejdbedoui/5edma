import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccessPermissions, AccessPermissionsPv, Permissions } from '../../../../model/AccessPermissions';
import { PointVente } from '../../../../model/PointVente';
import { Utilisateur } from '../../../../model/Utilisateur';
import { UtilisateurEndPointService } from '../../../../service/bp-api-admin/utilisateur-end-point/utilisateur-end-point.service';
import { PointVenteEndPointService } from '../../../../service/bp-api-pos/point-vente-end-point/point-vente-end-point.service';
import { GlobalServiceService } from '../../../../service/GlobalService/global-service.service';

@Component({
  selector: 'ngx-access-permissions',
  templateUrl: './access-permissions.component.html',
  styleUrls: ['./access-permissions.component.scss']
})
export class AccessPermissionsComponent implements OnInit {

  constructor(
    private pointVenteEndPointService: PointVenteEndPointService,
    private route: Router,
    private utilisateurEndPointService: UtilisateurEndPointService,
    private globalService: GlobalServiceService
  ) { }
  @Input()
  user: Utilisateur;
  accessPermissionsPv: AccessPermissionsPv[] = [];
  pvts: PointVente[] = [];
  selectedPvtPermissions: Permissions[] = [];
  settingsAccesPermissions: Permissions[] = [];
  hasAccesPointVente: boolean = false;
  hasAccesSettings: boolean = false;
  hasAdminAcces: boolean = false;
  showPermession: boolean = false;


  ngOnInit() {
    this.getpointVentes();

  }

  getpointVentes() {
    this.pointVenteEndPointService.findAllByIdPartenaireBprice(localStorage.getItem("partenaireid")).subscribe(pvts => {
      this.pvts = pvts.objectResponse != null ? pvts.objectResponse : [];
      this.checkExistedAccessPermissions();
    })
  }

  private checkExistedAccessPermissions() {
    if (this.user.accessPermissions != null) {
      this.hasAdminAcces = this.user.accessPermissions.adminPermission;
      this.hasAccesPointVente = this.user.accessPermissions.accessPermissionsPv != null;
      if (this.user.accessPermissions.settingsPermissions != null)
        this.hasAccesSettings = this.user.accessPermissions.settingsPermissions.filter(obj => obj.checked == false).length != this.user.accessPermissions.settingsPermissions.length ? true : false
          ;
      this.accessPermissionsPv = this.user.accessPermissions.accessPermissionsPv;
      this.settingsAccesPermissions = this.user.accessPermissions.settingsPermissions;
      console.log(this.settingsAccesPermissions);

    } else {
      this.createSettingsAccessPermissions();
      this.pvts.forEach(pvt => {
        this.createAccessPermissions(pvt);
      })
    }
  }

  private createAccessPermissions(pvt: PointVente) {
    let CommandesPermission: Permissions = new Permissions("Commandes", 1, false);
    let MvtsPermission: Permissions = new Permissions("Mvts stock", 1, false);
    let clientsPermission: Permissions = new Permissions("gestion client", 1, false);
    let EmployesPermission: Permissions = new Permissions("gestion employé", 1, false);
    let pushNotifPermission: Permissions = new Permissions("push notification", 1, false);
    let reglementPermission: Permissions = new Permissions("réglement", 1, false);
    let operationPermission: Permissions = new Permissions("gestion opération", 1, false);
    let bonPermission: Permissions = new Permissions("Bon livraision", 1, false);
    let etatStockPermission: Permissions = new Permissions("Etat stock", 1, false);

    let permissions: Permissions[] = [];
    if (pvt.typePv === 'centraleStock')
      permissions.push(MvtsPermission, bonPermission, operationPermission, etatStockPermission);
    else
      permissions.push(CommandesPermission, MvtsPermission, clientsPermission, EmployesPermission, pushNotifPermission,
        reglementPermission, operationPermission);

    let accessPermissionPv: AccessPermissionsPv = new AccessPermissionsPv(pvt.idPointVente, permissions);

    this.accessPermissionsPv.push(accessPermissionPv);
  }

  private createSettingsAccessPermissions() {
    let categoriesPermission: Permissions = new Permissions("Gestion Des Categories", 1, false);
    let produitsPermission: Permissions = new Permissions("Gestion Des Produits", 1, false);
    let packsPermission: Permissions = new Permissions("Gestion Des Packs", 1, false);
    let commercialePermission: Permissions = new Permissions("Action Commerciale", 1, false);
    let groupePermission: Permissions = new Permissions("Gestion Groupe Client", 1, false);
    let remisePermission: Permissions = new Permissions("Gestion Remise Rec", 1, false);
    let cadeauPermission: Permissions = new Permissions("Gestion Cadeau", 1, false);
    let ingredientPermission: Permissions = new Permissions("Gestion Ingredient", 1, false);
    let famillePermission: Permissions = new Permissions("Gestion Famille", 1, false);

    this.settingsAccesPermissions.push(categoriesPermission, produitsPermission, packsPermission, commercialePermission,
      groupePermission, remisePermission, cadeauPermission, ingredientPermission, famillePermission);
  }

  changePvt(idPointVente: string) {
    this.selectedPvtPermissions = this.accessPermissionsPv.find(el => el.pointVente == idPointVente).permissions;
    console.log(this.accessPermissionsPv);
  }

  returntolist() {
    this.route.navigateByUrl("/pages/Administration/GestionEmployes");
  }

  onSubmit() {

    let accessPermissions: AccessPermissions = new AccessPermissions();
    accessPermissions.accessPermissionsPv = this.accessPermissionsPv;
    accessPermissions.settingsPermissions = this.settingsAccesPermissions;
    accessPermissions.adminPermission = this.hasAdminAcces;
    this.utilisateurEndPointService.updateaccesspermissions(this.user.idUtilisateur, accessPermissions).subscribe(val => {
      this.globalService.showToast('success', "success", "droits modifiés avec succès")

      this.returntolist();
    }, error => {
      this.globalService.showToast("danger", "Erreur", "Un problème inattendu est survenu. Veuillez réessayer ultérieurement");
    })
  }

}
