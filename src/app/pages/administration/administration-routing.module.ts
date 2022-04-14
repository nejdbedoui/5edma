import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AdministrationComponent } from './administration.component';
import { GestionClientBpriceComponent } from './gestion-client-bprice/gestion-client-bprice.component';
import { CreateClientBpriceComponent } from './gestion-client-bprice/create-client-bprice/create-client-bprice.component';
import { GestionEmployesComponent } from './gestion-employes/gestion-employes.component';
import { CreateEmployesComponent } from './gestion-employes/create-employes/create-employes.component';
import { UpadeEmployesComponent } from './gestion-employes/upade-employes/upade-employes.component';
import { UserprofilComponent } from './userprofil/userprofil.component';

export const Adminroutes: Routes = [
  {
    path:'',
    component:AdministrationComponent,
    children:[
      {path:'gestionClientBprice',component:GestionClientBpriceComponent},
      {path:'gestionClientBprice/NouveauClientBprice',component:CreateClientBpriceComponent},
      {path:'GestionEmployes',component:GestionEmployesComponent},
      {path:'GestionEmployes/NouveauEmploye',component:CreateEmployesComponent},
      {path:'GestionEmployes/UpldateEmploye/:id',component:UpadeEmployesComponent},
      {path:'GestionUserProfil',component:UserprofilComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(Adminroutes)],
  exports: [RouterModule]
})
export class AdministrationRoutingModule { }
