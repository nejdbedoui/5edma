import { Injectable } from '@angular/core';
import { ClientDto } from '../../../model/dto/ClientDto';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientAnalyticsEndPointService {

  header = new HttpHeaders(
    {'Access-Control-Allow-Origin' : '*',
      'Content-type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT'}
  );

  constructor(private httpclient:HttpClient) { }

  GetAllClientMobile(clientDto:ClientDto){
      return this.httpclient.post<any>(environment.backend_url_Analytics+"GetAllClientMobile",clientDto,{ headers: this.header });
  }
  GetNewClient(clientDto:ClientDto){
    return this.httpclient.post<any>(environment.backend_url_Analytics+"GetNewClient",clientDto,{ headers: this.header });
  }
  GetNewClientMobile(clientDto:ClientDto){
    return this.httpclient.post<any>(environment.backend_url_Analytics+"GetNewClientMobile",clientDto,{ headers: this.header });
  }
}
