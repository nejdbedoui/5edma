import { environment } from './../../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PartenaireBpriceResponse } from '../../../model/response/PartenaireBpriceResponse';
import { PartenaireBprice } from '../../../model/PartenaireBprice';
import { OnePartenaireBpriceResponse } from '../../../model/response/OnePartenaireBpriceResponse';

@Injectable({
  providedIn: 'root'
})
export class PartenaireBpriceEndPointService {

  constructor(private httpclient:HttpClient) { }

  header = new HttpHeaders(
    {'Access-Control-Allow-Origin' : '*',
      'Content-type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT'}
);

CreatePartenaireBprice(partenaireBprice:PartenaireBprice){
  return this.httpclient.post<OnePartenaireBpriceResponse>(environment.backend_url_Pos+"CreatePartenaireBprice",partenaireBprice,{ headers: this.header });
}

findByIdPartenaire(id:string){
  return this.httpclient.get<OnePartenaireBpriceResponse>(environment.backend_url_Pos+"findByIdPartenaire/"+id,{ headers: this.header });
}

}
