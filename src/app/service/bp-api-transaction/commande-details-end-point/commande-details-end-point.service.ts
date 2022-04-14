import { Injectable } from '@angular/core';
import { CommandeDetails } from '../../../model/CommandeDetails';
import { CommandeDetailsResponse } from '../../../model/response/CommandeDetailsResponse';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { CommandeDetailsDtoResponse } from '../../../model/response/CommandeDetailsDtoResponset';

@Injectable({
  providedIn: 'root'
})
export class CommandeDetailsEndPointService {

  
  constructor(private httpclient:HttpClient) { }

  header = new HttpHeaders(
    {'Access-Control-Allow-Origin' : '*',
      'Content-type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT'}
);

findAllByIdTicket(idcommande:string){
  return this.httpclient.get<CommandeDetailsDtoResponse>(environment.backend_url_Transaction+"findAllByIdTicket/"+idcommande,{ headers: this.header });
}

findAllByIdTicketannuler(idcommande:string){
  return this.httpclient.get<CommandeDetailsDtoResponse>(environment.backend_url_Transaction+"findAllByIdTicketannuler/"+idcommande,{ headers: this.header });
}

findByIdCommandeDetailsAnuuler(idpv:string){
  return this.httpclient.get<any>(environment.backend_url_Transaction+"findByIdCommandeDetailsAnuuler/"+idpv,{ headers: this.header });
}
}
