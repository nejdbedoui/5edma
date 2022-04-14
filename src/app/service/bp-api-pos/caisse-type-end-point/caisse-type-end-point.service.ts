import { environment } from './../../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TypeCaisseResponse } from '../../../model/response/TypeCaisseResponse';

@Injectable({
  providedIn: 'root'
})
export class CaisseTypeEndPointService {

  constructor(private httpclient:HttpClient) { }

  header = new HttpHeaders(
    {'Access-Control-Allow-Origin' : '*',
      'Content-type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT'}
);

findalltypecaisse(){
  return this.httpclient.get<TypeCaisseResponse>(environment.backend_url_Pos+"findalltypecaisse",{ headers: this.header });
}
}
