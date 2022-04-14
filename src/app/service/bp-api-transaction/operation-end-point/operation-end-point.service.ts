import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Operation } from '../../../model/Operation';

@Injectable({
  providedIn: 'root'
})
export class OperationEndPointService {

  constructor(private httpclient:HttpClient) { }

  header = new HttpHeaders(
    {'Access-Control-Allow-Origin' : '*',
      'Content-type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT'}
);

CreateOperation(operation:Operation){
  return this.httpclient.post<any>(environment.backend_url_Transaction+"CreateOperation",operation,{ headers: this.header });
}

UpdateOperation(operation:Operation){
  return this.httpclient.put<any>(environment.backend_url_Transaction+"UpdateOperation",operation,{ headers: this.header });
}

DeleteOperation(idOperation:string){
  return this.httpclient.delete<any>(environment.backend_url_Transaction+"DeleteOperation/"+idOperation,{ headers: this.header });
}

findByIdPointVente(idPointVente:string){
  return this.httpclient.get<any>(environment.backend_url_Transaction+"findByIdPointVente/"+idPointVente,{ headers: this.header });
}

findByIdOperation(idOperation:string){
  return this.httpclient.get<any>(environment.backend_url_Transaction+"findByIdOperation/"+idOperation,{ headers: this.header });
}

findAllByIdEmploye(idEmploye:string){
  return this.httpclient.get<any>(environment.backend_url_Transaction+"findAllByIdEmploye/"+idEmploye,{ headers: this.header });
}

}
