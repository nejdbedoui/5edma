import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { GestionPointVenteComponent } from './gestion-point-vente.component';
import { GestionCaissesComponent } from './gestion-caisses/gestion-caisses.component';
import { CreateCaisseComponent } from './gestion-caisses/create-caisse/create-caisse.component';
import {GestionProduitComponent} from "./gestion-produit/gestion-produit.component";
import {CreateProduitComponent} from "./gestion-produit/create-produit/create-produit.component";
import { GestionCategorieComponent } from './gestion-categorie-article/gestion-categorie.component';
import { CreatecategorieComponent } from './gestion-categorie-article/createcategoriearticle/createcategorie.component';
import { UpdatecategorieComponent } from './gestion-categorie-article/updatecategoriearticle/updatecategorie.component';
import { GestionTransactionComponent } from './gestion-transaction/gestion-transaction.component';
import { ListproduitbytypeComponent } from './gestion-produit/listproduitbytype/listproduitbytype.component';
import { GestionTableComponent } from './gestion-table/gestion-table.component';
import { CreateTableComponent } from './gestion-table/create-table/create-table.component';
import { UpdateTableComponent } from './gestion-table/update-table/update-table.component';
import { RegleUtilisationComponent } from './regle-utilisation/regle-utilisation.component';
import { UpdateregleComponent } from './regle-utilisation/updateregle/updateregle.component';
import { CreateregleComponent } from './regle-utilisation/createregle/createregle.component';
import { UpdateProduitComponent } from './gestion-produit/update-produit/update-produit.component';
import { GestionProduitsArticlesComponent } from './gestion-produits-articles/gestion-produits-articles.component';
import { GestionRendezVousComponent } from './gestion-rendez-vous/gestion-rendez-vous.component';
import { CreateMouvementComponent } from './gestion-mouvement/create-mouvement/create-mouvement.component';
import { GestionMouvementComponent } from './gestion-mouvement/gestion-mouvement.component';
import { CreateModeReglementComponent } from './gestion-mode-reglement/create-mode-reglement/create-mode-reglement.component';
import { UpdateModeReglementComponent } from './gestion-mode-reglement/update-mode-reglement/update-mode-reglement.component';
import { GestionModeReglementComponent } from './gestion-mode-reglement/gestion-mode-reglement.component';
import { EditRendezVousComponent } from './gestion-rendez-vous/edit-rendez-vous/edit-rendez-vous.component';
import { CreateRendezVousComponent } from './gestion-rendez-vous/create-rendez-vous/create-rendez-vous.component';
import {GestionNotificationComponent} from "./gestion-notification/gestion-notification.component";
import {CreateNotificationComponent} from "./gestion-notification/create-notification/create-notification.component";
import {UpdateNotificationComponent} from "./gestion-notification/update-notification/update-notification.component";
import { CreatePacksComponent } from './gestion-packs/create-packs/create-packs.component';
import { UpdatePacksComponent } from './gestion-packs/update-packs/update-packs.component';
import { GestionPacksComponent } from './gestion-packs/gestion-packs.component';
import { GestionClientsComponent } from './gestion-clients/gestion-clients.component';
import { ActionCommercialeComponent } from './action-commerciale/action-commerciale.component';
import { CreateActionCommercialeComponent } from './action-commerciale/create-action-commerciale/create-action-commerciale.component';
import { UpdateActionCommercialeComponent } from './action-commerciale/update-action-commerciale/update-action-commerciale.component';
import { GestionGroupeClientComponent } from './gestion-groupe-client/gestion-groupe-client.component';
import { GestionremiserechageComponent } from './gestionremiserechage/gestionremiserechage.component';
import { CreateremiseComponent } from './gestionremiserechage/createremise/createremise.component';
import { UpdateremiseComponent } from './gestionremiserechage/updateremise/updateremise.component';
import { CategoriePossitionComponent } from './categorie-possition/categorie-possition.component';
import { GestionCadeauComponent } from './gestion-cadeau/gestion-cadeau.component';
import { CreateCadeauComponent } from './gestion-cadeau/create-cadeau/create-cadeau.component';
import { UpdateCadeauComponent } from './gestion-cadeau/update-cadeau/update-cadeau.component';
import { UpdateOperationComponent } from './gestion-operation/update-operation/update-operation.component';
import { CreateOperationComponent } from './gestion-operation/create-operation/create-operation.component';
import { GestionOperationComponent } from './gestion-operation/gestion-operation.component';
import { GestionIngredientComponent } from './gestion-ingredient/gestion-ingredient.component';
import { CreateIngredientComponent } from './gestion-ingredient/create-ingredient/create-ingredient.component';
import { UpdateIngredientComponent } from './gestion-ingredient/update-ingredient/update-ingredient.component';
import {ComparateurCaComponent} from './comparateur-ca/comparateur-ca.component';
import { AuthGuardService } from '../guards/auth-guard.service';
import { GestionFamilleComponent } from './gestion-famille/gestion-famille.component';
import { GestionZoneComponent } from './gestion-zone/gestion-zone.component';
import { CreateZoneComponent } from './gestion-zone/create-zone/create-zone.component';
import { UpdateZoneComponent } from './gestion-zone/update-zone/update-zone.component';
import { BonCommandeComponent } from './bon-commande/bon-commande.component';
import { FactureComponent } from './facture/facture.component';
import { CreateFactureComponent } from './facture/create-facture/create-facture.component';
import { GestionBonCommandesPvComponent } from './gestion-bon-commandes-pv/gestion-bon-commandes-pv.component';
import { CreateBonCommandePvComponent } from './gestion-bon-commandes-pv/create-bon-commande-pv/create-bon-commande-pv.component';
import { CreateCommandePvComponent } from './gestion-bon-commandes-pv/create-commande-pv/create-commande-pv.component';
import { GestionBonCommandesComponent } from './gestion-bon-commandes/gestion-bon-commandes.component';

export const Adminroutes: Routes = [
  {
    path:'',
    component:GestionPointVenteComponent,
    children:[
      {path:'gestionCaisses',component:GestionCaissesComponent,canActivate: [AuthGuardService]},
      {path:'gestionCaisses/NouveauCaisse',component:CreateCaisseComponent,canActivate: [AuthGuardService]},
      {path:'gestionCategorie',component:GestionCategorieComponent,canActivate: [AuthGuardService]},
      {path:'gestionCategorie/NouvelleCategorie',component:CreatecategorieComponent,canActivate: [AuthGuardService]},
      {path:'gestionProduit',component:GestionProduitComponent,canActivate: [AuthGuardService]},
      {path:'gestionProduit/NouveauProduit',component:CreateProduitComponent,canActivate: [AuthGuardService]},
      {path:'gestionProduit/ModifierProduit/:id',component:UpdateProduitComponent,canActivate: [AuthGuardService]},
      {path:'gestionCategorieArticle',component:GestionCategorieComponent,canActivate: [AuthGuardService]},
      {path:'gestionCategorieArticle/NouvelleCategorieArticle',component:CreatecategorieComponent,canActivate: [AuthGuardService]},
      {path:'gestionCategorieArticle/ModiferCategorieArticle/:id',component:UpdatecategorieComponent,canActivate: [AuthGuardService]},
      {path:'gestionCommande',component:GestionTransactionComponent,canActivate: [AuthGuardService]},
      {path:'gestionProduitParType',component:ListproduitbytypeComponent,canActivate: [AuthGuardService]},
      {path:'gestionTable',component:GestionTableComponent,canActivate: [AuthGuardService]},
      {path:'gestionTable/NouvelleTable',component:CreateTableComponent,canActivate: [AuthGuardService]},
      {path:'gestionTable/updateTable/:id',component:UpdateTableComponent,canActivate: [AuthGuardService]},
      {path:'RegleUtilisation',component:RegleUtilisationComponent,canActivate: [AuthGuardService]},
      {path:'RegleUtilisation/NouvelleRegle',component:CreateregleComponent,canActivate: [AuthGuardService]},
      {path:'RegleUtilisation/ModifierRegle/:id',component:UpdateregleComponent,canActivate: [AuthGuardService]},
      {path:'gestionProduitsArticles',component:GestionProduitsArticlesComponent,canActivate: [AuthGuardService]},
      {path:'gestionRendezVous',component:GestionRendezVousComponent,canActivate: [AuthGuardService]},
      {path:'gestionRendezVous/NouveauRendezVous',component:CreateRendezVousComponent,canActivate: [AuthGuardService]},
      {path:'gestionRendezVous/ModifierRendezVous/:id',component:EditRendezVousComponent,canActivate: [AuthGuardService]},
      {path:'gestionMouvement',component:GestionMouvementComponent,canActivate: [AuthGuardService]},
      {path:'gestionMouvement/NouveauMouvement',component:CreateMouvementComponent,canActivate: [AuthGuardService]},
      {path:'gestionModeReglement/NouveauModeReglement',component:CreateModeReglementComponent,canActivate: [AuthGuardService]},
      {path:'gestionModeReglement/ModifierModeReglement/:id',component:UpdateModeReglementComponent,canActivate: [AuthGuardService]},
      {path:'gestionModeReglement',component:GestionModeReglementComponent,canActivate: [AuthGuardService]},
      {path:'gestionNotification',component:GestionNotificationComponent,canActivate: [AuthGuardService]},
      {path:'gestionNotification/NouvelleNotification',component:CreateNotificationComponent,canActivate: [AuthGuardService]},
      {path:'gestionNotification/ModifierNotification/:id',component:UpdateNotificationComponent,canActivate: [AuthGuardService]},
      {path:'gestionPacks/NouveauPack',component:CreatePacksComponent,canActivate: [AuthGuardService]},
      {path:'gestionPacks/ModifierPack/:id',component:UpdatePacksComponent,canActivate: [AuthGuardService]},
      {path:'gestionPacks',component:GestionPacksComponent,canActivate: [AuthGuardService]},
      {path:'gestionClients',component:GestionClientsComponent,canActivate: [AuthGuardService]},
      {path:'actionCommerciale/NouvelleAction',component:CreateActionCommercialeComponent,canActivate: [AuthGuardService]},
      {path:'actionCommerciale/ModifierAction/:id',component:UpdateActionCommercialeComponent,canActivate: [AuthGuardService]},
      {path:'actionCommerciale',component:ActionCommercialeComponent,canActivate: [AuthGuardService]},
      {path:'gestionGroupeClientPartenaire',component:GestionGroupeClientComponent,canActivate: [AuthGuardService]},
      {path:'gestionRemises/NouvelleRemise',component:CreateremiseComponent,canActivate: [AuthGuardService]},
      {path:'gestionRemises/ModifierRemise/:id',component:UpdateremiseComponent,canActivate: [AuthGuardService]},
      {path:'gestionRemises',component:GestionremiserechageComponent,canActivate: [AuthGuardService]},
      {path:'possition',component:CategoriePossitionComponent,canActivate: [AuthGuardService]},
      {path:'gestionCadeau',component:GestionCadeauComponent,canActivate: [AuthGuardService]},
      {path:'gestionCadeau/NouveauCadeau',component:CreateCadeauComponent,canActivate: [AuthGuardService]},
      {path:'gestionCadeau/updateCadeau/:id',component:UpdateCadeauComponent,canActivate: [AuthGuardService]},
      {path:'gestionOperation',component:GestionOperationComponent,canActivate: [AuthGuardService]},
      {path:'gestionOperation/NouvelleOperation',component:CreateOperationComponent,canActivate: [AuthGuardService]},
      {path:'gestionOperation/ModifierOperation/:id',component:UpdateOperationComponent,canActivate: [AuthGuardService]},
      {path:'gestionIngredient',component:GestionIngredientComponent,canActivate: [AuthGuardService]},
      {path:'gestionIngredient/NouveauIngredient',component:CreateIngredientComponent,canActivate: [AuthGuardService]},
      {path:'gestionIngredient/ModifierIngredient/:id',component:UpdateIngredientComponent,canActivate: [AuthGuardService]},
      {path:'comparateurCA',component:ComparateurCaComponent,canActivate: [AuthGuardService]},
      {path:'gestionFamille',component:GestionFamilleComponent,canActivate: [AuthGuardService]},
      {path:'gestionZone',component:GestionZoneComponent,canActivate: [AuthGuardService]},
      {path:'gestionZone/NouvelleZone',component:CreateZoneComponent,canActivate: [AuthGuardService]},
      {path:'gestionZone/updateZone/:id',component:UpdateZoneComponent,canActivate: [AuthGuardService]},
      {path:'boncommande',component:BonCommandeComponent,canActivate: [AuthGuardService]},
      {path:'facturation',component:FactureComponent,canActivate: [AuthGuardService]},
      {path:'facturation/NouvelleFacture',component:CreateFactureComponent,canActivate: [AuthGuardService]},
      {path:'gestionBonCommandePv',component:GestionBonCommandesPvComponent,canActivate: [AuthGuardService]},
      {path:'gestionBonCommandePv/NouvelleBonCommandePv',component:CreateBonCommandePvComponent,canActivate: [AuthGuardService]},
      {path:'gestionBonCommandePv/NouvelleCommande/:idb/:idc',component:CreateCommandePvComponent,canActivate: [AuthGuardService]},
      {path:'gestionBonCommande',component:GestionBonCommandesComponent,canActivate: [AuthGuardService]},
      
      
      
      
      
      

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(Adminroutes)],
  exports: [RouterModule]
})
export class GestionPointVenteRoutingModule { }
