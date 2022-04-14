import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FournisseurEndPointService {

  constructor(private httpclient:HttpClient) { }

  header = new HttpHeaders(
    {'Access-Control-Allow-Origin' : '*',
      'Content-type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT'}
);

findAllfourinsseur(){
  return this.httpclient.get<any>(environment.backend_url_Product+"findAllfourinsseur",{ headers: this.header });
}

findAllByIdPatenaireBprice(idpartenaire){
  return this.httpclient.get<any>(environment.backend_url_Product+"findAllByIdPatenaireBprice/"+idpartenaire,{ headers: this.header });
}
}
