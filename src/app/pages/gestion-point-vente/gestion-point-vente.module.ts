import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GestionCaissesComponent } from './gestion-caisses/gestion-caisses.component';
import { GestionPointVenteComponent } from './gestion-point-vente.component';
import { CreateCaisseComponent } from './gestion-caisses/create-caisse/create-caisse.component';
import { UpdateCaisseComponent } from './gestion-caisses/update-caisse/update-caisse.component';
import { GestionPointVenteRoutingModule } from './gestion-point-vente-routing.module';
import { ThemeModule } from '../../@theme/theme.module';
import { NbTooltipModule, NbMenuModule, NbCardModule, NbInputModule, NbButtonModule, NbRadioModule, NbCheckboxModule, NbStepperModule, NbSelectModule, NbSpinnerModule, NbTabsetModule, NbIconModule, NbDatepickerModule, } from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BreadCrumbModule } from '../../bread-crumb/bread-crumb.module';
import { DataTablesModule } from 'angular-datatables';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { DataViewModule } from 'primeng/dataview';
import { PanelModule } from 'primeng/panel';
import { DropdownModule } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
import { GestionProduitComponent } from './gestion-produit/gestion-produit.component';
import { CreateProduitComponent } from './gestion-produit/create-produit/create-produit.component';
import { GestionCategorieComponent } from './gestion-categorie-article/gestion-categorie.component';
import { CreatecategorieComponent } from './gestion-categorie-article/createcategoriearticle/createcategorie.component';
import { UpdatecategorieComponent } from './gestion-categorie-article/updatecategoriearticle/updatecategorie.component';
import { SplitButtonModule } from 'primeng/splitbutton';
import { GestionTransactionComponent } from './gestion-transaction/gestion-transaction.component';
import { ListproduitbytypeComponent } from './gestion-produit/listproduitbytype/listproduitbytype.component';
import { GestionTableComponent } from './gestion-table/gestion-table.component';
import { CreateTableComponent } from './gestion-table/create-table/create-table.component';
import { UpdateTableComponent } from './gestion-table/update-table/update-table.component';
import { RegleUtilisationComponent } from './regle-utilisation/regle-utilisation.component';
import { CalendarModule } from 'primeng/calendar';
import { CreateregleComponent } from './regle-utilisation/createregle/createregle.component';
import { UpdateregleComponent } from './regle-utilisation/updateregle/updateregle.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { UpdateProduitComponent } from './gestion-produit/update-produit/update-produit.component';
import { FileUploadModule } from 'primeng/fileupload';
import { GestionProduitsArticlesComponent } from './gestion-produits-articles/gestion-produits-articles.component';
import { GestionClientsComponent } from './gestion-clients/gestion-clients.component';
import { GestionRendezVousComponent } from './gestion-rendez-vous/gestion-rendez-vous.component';
import { FullCalendarModule } from 'primeng/fullcalendar';
import { CreateRendezVousComponent } from './gestion-rendez-vous/create-rendez-vous/create-rendez-vous.component';
import { EditRendezVousComponent } from './gestion-rendez-vous/edit-rendez-vous/edit-rendez-vous.component';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { GestionMouvementComponent } from './gestion-mouvement/gestion-mouvement.component';
import { CreateMouvementComponent } from './gestion-mouvement/create-mouvement/create-mouvement.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { GestionModeReglementComponent } from './gestion-mode-reglement/gestion-mode-reglement.component';
import { CreateModeReglementComponent } from './gestion-mode-reglement/create-mode-reglement/create-mode-reglement.component';
import { UpdateModeReglementComponent } from './gestion-mode-reglement/update-mode-reglement/update-mode-reglement.component';
import { TreeModule } from 'primeng/tree';
import { GestionNotificationComponent } from './gestion-notification/gestion-notification.component';
import { CreateNotificationComponent } from './gestion-notification/create-notification/create-notification.component';
import { UpdateNotificationComponent } from './gestion-notification/update-notification/update-notification.component';

import { GestionPacksComponent } from './gestion-packs/gestion-packs.component';
import { CreatePacksComponent } from './gestion-packs/create-packs/create-packs.component';
import { UpdatePacksComponent } from './gestion-packs/update-packs/update-packs.component';
import { ProduitfilterComponent } from './produitfilter/produitfilter.component';
import { ActionCommercialeComponent } from './action-commerciale/action-commerciale.component';
import { CreateActionCommercialeComponent } from './action-commerciale/create-action-commerciale/create-action-commerciale.component';
import { UpdateActionCommercialeComponent } from './action-commerciale/update-action-commerciale/update-action-commerciale.component';
import { GestionGroupeClientComponent } from './gestion-groupe-client/gestion-groupe-client.component';
import { GestionremiserechageComponent } from './gestionremiserechage/gestionremiserechage.component';
import { CreateremiseComponent } from './gestionremiserechage/createremise/createremise.component';
import { UpdateremiseComponent } from './gestionremiserechage/updateremise/updateremise.component';
import { CategoriePossitionComponent } from './categorie-possition/categorie-possition.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { GestionCadeauComponent } from './gestion-cadeau/gestion-cadeau.component';
import { CreateCadeauComponent } from './gestion-cadeau/create-cadeau/create-cadeau.component';
import { UpdateCadeauComponent } from './gestion-cadeau/update-cadeau/update-cadeau.component';
import { GestionOperationComponent } from './gestion-operation/gestion-operation.component';
import { CreateOperationComponent } from './gestion-operation/create-operation/create-operation.component';
import { UpdateOperationComponent } from './gestion-operation/update-operation/update-operation.component';
import { GestionIngredientComponent } from './gestion-ingredient/gestion-ingredient.component';
import { CreateIngredientComponent } from './gestion-ingredient/create-ingredient/create-ingredient.component';
import { UpdateIngredientComponent } from './gestion-ingredient/update-ingredient/update-ingredient.component';
import { ComparateurCaComponent } from './comparateur-ca/comparateur-ca.component';
import { ChartModule } from 'primeng/chart';
import { GestionFamilleComponent } from './gestion-famille/gestion-famille.component';
import { GestionZoneComponent } from './gestion-zone/gestion-zone.component';
import { CreateZoneComponent } from './gestion-zone/create-zone/create-zone.component';
import { UpdateZoneComponent } from './gestion-zone/update-zone/update-zone.component';
import { BonCommandeComponent } from './bon-commande/bon-commande.component';
import { ToastModule } from 'primeng/toast';
import { FactureComponent } from './facture/facture.component';
import { CreateFactureComponent } from './facture/create-facture/create-facture.component';
import { GestionBonCommandesPvComponent } from './gestion-bon-commandes-pv/gestion-bon-commandes-pv.component';
import { CreateBonCommandePvComponent } from './gestion-bon-commandes-pv/create-bon-commande-pv/create-bon-commande-pv.component';
import { CreateCommandePvComponent } from './gestion-bon-commandes-pv/create-commande-pv/create-commande-pv.component';
import { ButtonModule } from 'primeng/primeng';
import { GestionBonCommandesComponent } from './gestion-bon-commandes/gestion-bon-commandes.component';



@NgModule({
  declarations: [GestionCaissesComponent, GestionPointVenteComponent, CreateCaisseComponent, UpdateCaisseComponent, GestionCategorieComponent, CreatecategorieComponent, UpdatecategorieComponent, GestionProduitComponent, CreateProduitComponent,
    GestionTransactionComponent, ListproduitbytypeComponent, GestionTableComponent, CreateTableComponent, UpdateTableComponent, RegleUtilisationComponent, CreateregleComponent, UpdateregleComponent, UpdateProduitComponent,
    GestionProduitsArticlesComponent, GestionClientsComponent, GestionRendezVousComponent, CreateRendezVousComponent,
    EditRendezVousComponent, GestionMouvementComponent, CreateMouvementComponent, GestionModeReglementComponent,
    CreateModeReglementComponent, UpdateModeReglementComponent, GestionPacksComponent, CreatePacksComponent,
    UpdatePacksComponent, ProduitfilterComponent, ActionCommercialeComponent, CreateActionCommercialeComponent,
    UpdateActionCommercialeComponent, GestionNotificationComponent, CreateNotificationComponent,
    UpdateNotificationComponent, GestionGroupeClientComponent, GestionremiserechageComponent, CreateremiseComponent,
    UpdateremiseComponent, CategoriePossitionComponent, GestionCadeauComponent, CreateCadeauComponent,
    UpdateCadeauComponent, GestionOperationComponent, CreateOperationComponent, UpdateOperationComponent,
    GestionIngredientComponent, CreateIngredientComponent, UpdateIngredientComponent, ComparateurCaComponent, GestionFamilleComponent, GestionZoneComponent, CreateZoneComponent, UpdateZoneComponent, BonCommandeComponent, FactureComponent, CreateFactureComponent, GestionBonCommandesPvComponent,GestionBonCommandesPvComponent, CreateBonCommandePvComponent, CreateCommandePvComponent, GestionBonCommandesComponent],
  imports: [
    CommonModule,
    NbDatepickerModule,
    GestionPointVenteRoutingModule,
    ThemeModule,
    NbMenuModule,
    NbCardModule,
    FormsModule,
    NbInputModule,
    NbButtonModule,
    NbRadioModule,
    NbCheckboxModule,
    ReactiveFormsModule,
    NbStepperModule,
    ReactiveFormsModule,
    NbSelectModule,
    NbSpinnerModule,
    BreadCrumbModule,
    DataTablesModule,
    DialogModule,
    TableModule,
    NbTabsetModule,
    DataViewModule,
    PanelModule,
    FieldsetModule,
    DropdownModule,
    SplitButtonModule,
    CalendarModule,
    ColorPickerModule,
    FileUploadModule,
    FullCalendarModule,
    ToggleButtonModule,
    AutocompleteLibModule,
    NbTooltipModule,
    TreeModule,
    DragDropModule,
    NbIconModule,
    ChartModule,
    ToastModule,

  ]
})
export class GestionPointVenteModule { }
