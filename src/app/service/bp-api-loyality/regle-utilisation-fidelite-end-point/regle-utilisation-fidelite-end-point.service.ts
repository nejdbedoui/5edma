import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { OneRegleUtilisationFideliteResponse } from '../../../model/response/OneRegleUtilisationFideliteResponse';
import { environment } from '../../../../environments/environment';
import { RegleUtilisationFideliteResponse } from '../../../model/response/RegleUtilisationFideliteResponse';
import { RegleUtilisationFidelite } from '../../../model/RegleUtilisationFidelite';

@Injectable({
  providedIn: 'root'
})
export class RegleUtilisationFideliteEndPointService {

  constructor(private httpclient:HttpClient) { }

  header = new HttpHeaders(
    {'Access-Control-Allow-Origin' : '*',
      'Content-type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT'}
);

CreateRegleUtilisationFidelite(regle:RegleUtilisationFidelite){
  return this.httpclient.post<OneRegleUtilisationFideliteResponse>(environment.backend_url_loyality+"CreateRegleUtilisationFidelite",regle,{ headers: this.header });
}


findByIdRegleUtilisationFidelite(id:string){
  return this.httpclient.get<OneRegleUtilisationFideliteResponse>(environment.backend_url_loyality+"findByIdRegleUtilisationFidelite/"+id,{ headers: this.header });
}

findAllRegleUtilisationByIdPointVente(idPointVente:string){
  return this.httpclient.get<RegleUtilisationFideliteResponse>(environment.backend_url_loyality+"findAllRegleUtilisationByIdPointVente/"+idPointVente,{ headers: this.header });
}

DeleteRegleUtilisationFidelite(id:string){
  return this.httpclient.delete<any>(environment.backend_url_loyality+"DeleteRegleUtilisationFidelite/"+id,{ headers: this.header });

}
}
