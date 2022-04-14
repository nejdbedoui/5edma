import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Pack } from '../../../model/Pack';

@Injectable({
  providedIn: 'root'
})
export class PackEndPointService {

  constructor(private httpclient:HttpClient) { }

  header = new HttpHeaders(
    {'Access-Control-Allow-Origin' : '*',
      'Content-type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT'}
);

findAllPacktByIdpartner(idPartenaire:string){
  return this.httpclient.get<any>(environment.backend_url_Product+"findAllPacktByIdpartner/"+idPartenaire,{ headers: this.header });
}

createPack(pack:Pack){
  return this.httpclient.post<any>(environment.backend_url_Product+"createPack",pack,{ headers: this.header });
}

findByIdPackt(idPack:string){
  return this.httpclient.get<any>(environment.backend_url_Product+"findByIdPackt/"+idPack,{ headers: this.header });

}

DeletePack(idPack:string){
  return this.httpclient.delete<any>(environment.backend_url_Product+"DeletePack/"+idPack,{ headers: this.header });

}
}
