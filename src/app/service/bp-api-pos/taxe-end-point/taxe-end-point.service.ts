import { environment } from './../../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TaxeResponse } from '../../../model/response/TaxeResponse';
import { Taxe } from '../../../model/Taxe';

@Injectable({
  providedIn: 'root'
})
export class TaxeEndPointService {

  
  constructor(private httpclient:HttpClient) { }

  header = new HttpHeaders(
    {'Access-Control-Allow-Origin' : '*',
      'Content-type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT'}
);

findAlltaxeByFActif(factif:number){
  return this.httpclient.get<TaxeResponse>(environment.backend_url_Pos+"findAlltaxeByFActif/"+factif,{ headers: this.header });
}

CreateTaxe(taxe:Taxe){
  return this.httpclient.post<TaxeResponse>(environment.backend_url_Pos+"CreateTaxe",taxe,{ headers: this.header });
}
}
