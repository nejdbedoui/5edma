import { Injectable } from '@angular/core';
import { DeviseResponse } from '../../../model/response/DeviseResponse';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Devise } from '../../../model/Devise';
import { OneDeviseResponse } from '../../../model/response/OneDeviseResponse';

@Injectable({
  providedIn: 'root'
})
export class DeviseEndPointService {

  
  constructor(private httpclient:HttpClient) { }

  header = new HttpHeaders(
    {'Access-Control-Allow-Origin' : '*',
      'Content-type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT'}
);

CreateDevise(devise:Devise){
  return this.httpclient.post<OneDeviseResponse>(environment.backend_url_Pos+"CreateDevise",devise,{ headers: this.header });
}
findAllByIdPointVenteIsNull(){
  return this.httpclient.get<DeviseResponse>(environment.backend_url_Pos+"findAllByIdPointVenteIsNull",{ headers: this.header });

}
findAllByIdPointVenteAndFDefaut(idPointVente:string,fDefault:number){
  return this.httpclient.get<DeviseResponse>(environment.backend_url_Pos+"findAllByIdPointVenteAndFDefaut/"+idPointVente+"/"+fDefault,{ headers: this.header });
}

}
