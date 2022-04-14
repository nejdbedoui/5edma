import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {BreadCrumbComponent} from "./bread-crumb.component";
import {RouterModule} from "@angular/router";
import {HttpClient} from "@angular/common/http";



@NgModule({
  declarations: [BreadCrumbComponent],
  exports: [
    BreadCrumbComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class BreadCrumbModule { }
