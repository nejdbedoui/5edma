import {LeafletModule} from '@asymmetrik/ngx-leaflet';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GestionClientBpriceComponent } from './gestion-client-bprice/gestion-client-bprice.component';
import { ThemeModule } from '../../@theme/theme.module';
import { NbMenuModule, NbCardModule, NbInputModule, NbButtonModule, NbRadioModule, NbCheckboxModule, NbStepperModule, NbSelectModule, NbSpinnerModule, NbTabsetModule, NbTooltipModule, NbDatepickerModule } from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateClientBpriceComponent } from './gestion-client-bprice/create-client-bprice/create-client-bprice.component';
import { AdministrationRoutingModule } from './administration-routing.module';
import { AdministrationComponent } from './administration.component';
import { BreadCrumbModule } from '../../bread-crumb/bread-crumb.module';
import { DataTablesModule } from 'angular-datatables';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import {AccordionModule} from 'primeng/accordion';
import { GestionEmployesComponent } from './gestion-employes/gestion-employes.component';
import { CreateEmployesComponent } from './gestion-employes/create-employes/create-employes.component';
import { UpadeEmployesComponent } from './gestion-employes/upade-employes/upade-employes.component';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import { ColorPickerModule } from 'ngx-color-picker';
import { UserprofilComponent } from './userprofil/userprofil.component';
import { AccessPermissionsComponent } from './gestion-employes/access-permissions/access-permissions.component';

@NgModule({
  declarations: [GestionClientBpriceComponent, CreateClientBpriceComponent,AdministrationComponent, GestionEmployesComponent, CreateEmployesComponent, UpadeEmployesComponent, UserprofilComponent, AccessPermissionsComponent],
  imports: [
    CommonModule,
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
    AdministrationRoutingModule,
    BreadCrumbModule,
    DataTablesModule,
    DialogModule,
    TableModule,
    NbTabsetModule,
    LeafletModule.forRoot(),
    AccordionModule,
    AutocompleteLibModule,
    ColorPickerModule,
    NbTooltipModule,
    NbDatepickerModule
  ]
})
export class AdministrationModule { }
