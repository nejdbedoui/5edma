import { environment } from './../../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProfilResponse } from '../../../model/response/ProfilResponse';

@Injectable({
  providedIn: 'root'
})
export class ProfilEndPointService {

  constructor(private httpclient:HttpClient) { }

  header = new HttpHeaders(
    {'Access-Control-Allow-Origin' : '*',
      'Content-type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT'}
);

findAllprofilByFActif(factif:number){
  return this.httpclient.get<ProfilResponse>(environment.backend_url_Admin+"findAllprofilByFActif/"+factif,{ headers: this.header });
}
}
