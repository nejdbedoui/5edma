import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { RemiseRechagePartenaire } from '../../../model/RemiseRechagePartenaire';

@Injectable({
  providedIn: 'root'
})
export class RemiseRechagePartenaireEndPointService {

  constructor(private httpclient:HttpClient) { }

  header = new HttpHeaders(
    {'Access-Control-Allow-Origin' : '*',
      'Content-type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT'}
);

CreateremiseRechagePartenaire(remiseRechagePartenaire:RemiseRechagePartenaire){
  return this.httpclient.post<any>(environment.backend_url_Product+"CreateremiseRechagePartenaire",remiseRechagePartenaire,{ headers: this.header });
}
findAllAtifRemiseByIdpartner(id:string){
  return this.httpclient.get<any>(environment.backend_url_Product+"findAllAtifRemiseByIdpartner/"+id,{ headers: this.header });
}

findByIdremiseRechagePartenaire(idremiseRechagePartenaire:string){
  return this.httpclient.get<any>(environment.backend_url_Product+"findByIdremiseRechagePartenaire/"+idremiseRechagePartenaire,{ headers: this.header });
}
findAllRemiseByIdpartner(id:string){
  return this.httpclient.get<any>(environment.backend_url_Product+"findAllRemiseByIdpartner/"+id,{ headers: this.header });
}
}
