import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, Route } from '@angular/router';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class RoleGuardService implements CanActivate {

  constructor(private _router: Router) { }
  valll:boolean =false

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    //localStorage.setItem("log","0");
    if (localStorage.getItem("UserId")!=null) {
      return true;
  }else{
    this._router.navigateByUrl('/auth/login');
    // you can save redirect url so after authing we can move them back to the page they requested
    return false;
  }
    




  }

}
