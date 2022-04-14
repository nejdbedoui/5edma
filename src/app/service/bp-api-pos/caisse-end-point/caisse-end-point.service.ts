import { environment } from './../../../../environments/environment';
import { Injectable } from '@angular/core';
import { Caisse } from '../../../model/Caisse';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CaisseResponse } from '../../../model/response/CaisseResponse';
import { OneCaisseResponse } from '../../../model/response/OneCaisseResponse';

@Injectable({
  providedIn: 'root'
})
export class CaisseEndPointService {

  constructor(private httpclient:HttpClient) { }

  header = new HttpHeaders(
    {'Access-Control-Allow-Origin' : '*',
      'Content-type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT'}
);

CreateCaisse(caisse:Caisse){
  return this.httpclient.post<OneCaisseResponse>(environment.backend_url_Pos+"CreateCaisse",caisse,{ headers: this.header });
}
findAllCaisseByidPointVente(idPointvente:string){
  return this.httpclient.get<any>(environment.backend_url_Pos+"findAllCaisseByidPointVente/"+idPointvente,{ headers: this.header });
}
}
