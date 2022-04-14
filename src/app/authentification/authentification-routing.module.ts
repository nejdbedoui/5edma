import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {AuthentificationComponent} from "./authentification.component";
import {LoginComponent} from "./login/login.component";
import {ResetPasswordComponent} from "./reset-password/reset-password.component";
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { MailpasswordComponent } from './mailpassword/mailpassword.component';
import { ChoosepointventeComponent } from './choosepointvente/choosepointvente.component';




export const Authroutes: Routes = [
  {
   path:'',
   component:AuthentificationComponent,
   children:[
     {path: 'login', component: LoginComponent,},
     {path: 'resetPassword', component: ResetPasswordComponent},
     {path: 'forgotPassword', component: ForgotpasswordComponent},
     {path: 'mailPassword', component: MailpasswordComponent},
     {path: 'choosepointvente', component: ChoosepointventeComponent}
     ]
  }
  ];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(Authroutes)],
  exports: [RouterModule],
})
export class AuthentificationRoutingModule { }
