import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SectorResponse } from '../../../model/response/SectorResponse';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SectorEndPointService {

  constructor(private httpclient:HttpClient) { }

  header = new HttpHeaders(
    {'Access-Control-Allow-Origin' : '*',
      'Content-type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT'}
);

findAllSectorByFActif(factif:number){
  return this.httpclient.get<SectorResponse>(environment.backend_url_Pos+"findAllSectorByFActif/"+factif,{ headers: this.header });
}

}
