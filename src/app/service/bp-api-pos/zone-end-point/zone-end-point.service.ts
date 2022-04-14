import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Zone } from '../../../model/Zone';

@Injectable({
  providedIn: 'root'
})
export class ZoneEndPointService {

  constructor(private httpclient:HttpClient) { }

  header = new HttpHeaders(
    {'Access-Control-Allow-Origin' : '*',
      'Content-type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT'}
);


  findAllByIdPointVente(idPointVente:string){
    return this.httpclient.get<any>(environment.backend_url_Pos+"findAllZoneByIdPointVente/"+idPointVente,{ headers: this.header });
  }

  findByIdZone(idZone:string){
    return this.httpclient.get<any>(environment.backend_url_Pos+"findByIdZone/"+idZone,{ headers: this.header });
  }

  createZone(zone : any){
    return this.httpclient.post<any>(environment.backend_url_Pos+"CreateZone",zone,{ headers: this.header });
  }

  deleteZone(idZone:string){
    return this.httpclient.delete<any>(environment.backend_url_Pos+"DeleteZone/"+idZone,{ headers: this.header });
  }
  
}
