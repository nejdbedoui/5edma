import { GestionCaissesComponent } from './gestion-point-vente/gestion-caisses/gestion-caisses.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ECommerceComponent } from './e-commerce/e-commerce.component';
import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';
import { AuthGuardService } from './guards/auth-guard.service';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: 'dashboard',
      component: ECommerceComponent,
    },
    {
      path: 'iot-dashboard',
      component: DashboardComponent,
    },
    {
      path: 'Administration',
      loadChildren: () => import('app/pages/administration/administration.module')
        .then(m => m.AdministrationModule),
        canActivate: [AuthGuardService],
    },
    {
      path: 'Pointvente',
      loadChildren: () => import('app/pages/gestion-point-vente/gestion-point-vente.module')
        .then(m => m.GestionPointVenteModule),
        canActivate: [AuthGuardService],
    },
    {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full',
      canActivate: [AuthGuardService],
    },
    {
      path: '**',
      component: NotFoundComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
