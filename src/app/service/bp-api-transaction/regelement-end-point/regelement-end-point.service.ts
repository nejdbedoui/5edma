import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ReglementDtoResponse } from '../../../model/response/ReglementDtoResponse';

@Injectable({
  providedIn: 'root'
})
export class RegelementEndPointService {

  
  constructor(private httpclient:HttpClient) { }

  header = new HttpHeaders(
    {'Access-Control-Allow-Origin' : '*',
      'Content-type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT'}
);

findAllRegelementByIdTicket(idticket:string){
  return this.httpclient.get<ReglementDtoResponse>(environment.backend_url_Transaction+"findAllRegelementByIdTicket/"+idticket,{ headers: this.header });
}
}
