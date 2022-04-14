import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { TypeUtilisateurReponse } from '../../../model/response/TypeUtilisateurReponse';

@Injectable({
  providedIn: 'root'
})
export class UtilisateurTypeEndPointService {

  constructor(private httpclient:HttpClient) { }

  header = new HttpHeaders(
    {'Access-Control-Allow-Origin' : '*',
      'Content-type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT'}
);

findAllTypeUtilisateurByFActif(factif:number){
  return this.httpclient.get<TypeUtilisateurReponse>(environment.backend_url_Admin+"findAllTypeUtilisateurByFActif/"+factif,{ headers: this.header });
}
}
