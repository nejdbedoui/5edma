import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RegleUtilisationFidelite } from '../../../model/RegleUtilisationFidelite';
import { OneRegleUtilisationFideliteResponse } from '../../../model/response/OneRegleUtilisationFideliteResponse';
import { environment } from '../../../../environments/environment';
import { RegleUtilisationFideliteResponse } from '../../../model/response/RegleUtilisationFideliteResponse';
import { ReglesFideliteProduit } from '../../../model/ReglesFideliteProduit';

@Injectable({
  providedIn: 'root'
})
export class ReglesFideliteProduitEndPointService {

  constructor(private httpclient:HttpClient) { }

  header = new HttpHeaders(
    {'Access-Control-Allow-Origin' : '*',
      'Content-type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT'}
);

CreateReglesFideliteProduit(regle:ReglesFideliteProduit){
  return this.httpclient.post<any>(environment.backend_url_loyality+"CreateReglesFideliteProduit",regle,{ headers: this.header });
}


findByIdReglesFideliteProduit(idReglesFideliteProduit:string){
  return this.httpclient.get<any>(environment.backend_url_loyality+"findByIdReglesFideliteProduit/"+idReglesFideliteProduit,{ headers: this.header });
}

findAllReglesFideliteProduitByIdProduit(idProduit:string){
  return this.httpclient.get<any>(environment.backend_url_loyality+"findAllReglesFideliteProduitByIdProduit/"+idProduit,{ headers: this.header });
}

DeleteReglesFideliteProduit(idReglesFideliteProduit:string){
  return this.httpclient.delete<any>(environment.backend_url_loyality+"DeleteReglesFideliteProduit/"+idReglesFideliteProduit,{ headers: this.header });
}
findAllReglesFideliteProduitByIdPartenaire(idpartenaire:string){
  return this.httpclient.get<any>(environment.backend_url_loyality+"findAllReglesFideliteProduitByIdPartenaire/"+idpartenaire,{ headers: this.header });

}
}
