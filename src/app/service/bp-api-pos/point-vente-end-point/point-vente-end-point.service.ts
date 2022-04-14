import { environment } from './../../../../environments/environment';
import { Injectable } from '@angular/core';
import { PointVenteResponse } from '../../../model/response/PointVenteResponse';
import { PointVente } from '../../../model/PointVente';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { OnePointVenteResponse } from '../../../model/response/OnePointVenteResponse';

@Injectable({
  providedIn: 'root'
})
export class PointVenteEndPointService {

  constructor(private httpclient:HttpClient) { }

  header = new HttpHeaders(
    {'Access-Control-Allow-Origin' : '*',
      'Content-type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT'}
);

CreatePointVente(pointVente:PointVente){
  return this.httpclient.post<OnePointVenteResponse>(environment.backend_url_Pos+"CreatePointVente",pointVente,{ headers: this.header });
}

findAllByIdPartenaireBprice(id:string){
  return this.httpclient.get<PointVenteResponse>(environment.backend_url_Pos+"findAllByIdPartenaireBprice/"+id,{ headers: this.header });
}
  findPointVenteByIdPointVente(pointVenteId:string){
    return this.httpclient.get<OnePointVenteResponse>(environment.backend_url_Pos+"findPointVenteByIdPointVente/"+pointVenteId,{ headers: this.header });
  }
}
