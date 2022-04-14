import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from "@angular/router";
import {AuthentificationRoutingModule, Authroutes} from "./authentification-routing.module";
import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import {
  NbAlertModule,
  NbButtonModule,
  NbCardModule,
  NbDialogModule,
  NbInputModule,
  NbLayoutModule,
  NbToggleModule
} from "@nebular/theme";
import {AuthentificationComponent} from "./authentification.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { PasswordStrengthBarModule } from 'ng2-password-strength-bar';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { MailpasswordComponent } from './mailpassword/mailpassword.component';
import { ChoosepointventeComponent } from './choosepointvente/choosepointvente.component'
import { DataViewModule } from 'primeng/dataview';
import { PanelModule } from 'primeng/panel';
import { DropdownModule } from 'primeng/dropdown';
@NgModule({
  declarations: [AuthentificationComponent,LoginComponent, ResetPasswordComponent, ForgotpasswordComponent, MailpasswordComponent, ChoosepointventeComponent],
  imports: [

    CommonModule,
    AuthentificationRoutingModule,
    NbLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    NbDialogModule.forChild(),
    NbCardModule,
    NbInputModule,
    NbButtonModule,
    NbToggleModule,
    PasswordStrengthBarModule,
    NbAlertModule,
    DataViewModule,
    PanelModule,
    DropdownModule
  ],
  entryComponents: [
  ],
})
export class AuthentificationModule { }
