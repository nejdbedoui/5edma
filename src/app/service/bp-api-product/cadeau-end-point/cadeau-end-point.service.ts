import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Cadeau } from '../../../model/Cadeau';

@Injectable({
  providedIn: 'root'
})
export class CadeauEndPointService {

  constructor(private httpclient:HttpClient) { }

  header = new HttpHeaders(
    {'Access-Control-Allow-Origin' : '*',
      'Content-type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT'}
);

CreateCadeau(cadeau:Cadeau){
  return this.httpclient.post<any>(environment.backend_url_Product+"CreateCadeau",cadeau,{ headers: this.header });
}
UpdateCadeau(cadeau:Cadeau){
  return this.httpclient.put<any>(environment.backend_url_Product+"UpdateCadeau",cadeau,{ headers: this.header });
}
DeleteCadeau(idCadeau:string){
  return this.httpclient.delete<any>(environment.backend_url_Product+"DeleteCadeau/"+idCadeau,{ headers: this.header });
}
findByIdpartenaire(idpartenaire:string){
  return this.httpclient.get<any>(environment.backend_url_Product+"findByIdpartenaire/"+idpartenaire,{ headers: this.header });
}
findcadeaubyid(idcadeau:string){
  return this.httpclient.get<any>(environment.backend_url_Product+"findcadeaubyid/"+idcadeau,{ headers: this.header });
}
}
