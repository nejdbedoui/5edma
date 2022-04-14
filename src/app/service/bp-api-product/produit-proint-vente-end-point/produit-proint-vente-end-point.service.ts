import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProdcutResponse } from '../../../model/response/ProdcutResponse';
import { environment } from '../../../../environments/environment';
import { Produitpointvente } from '../../../model/Produitpointvente';

@Injectable({
  providedIn: 'root'
})
export class ProduitProintVenteEndPointService {

  
  constructor(private httpclient:HttpClient) { }

  header = new HttpHeaders(
    {'Access-Control-Allow-Origin' : '*',
      'Content-type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT'}
);

findAllProduitPointVenteByIdPointVente(idpointvente:string){
  return this.httpclient.get<any>(environment.backend_url_Product+"findAllProduitPointVenteByIdPointVente/"+idpointvente,{ headers: this.header });
}

updateProduitProintVente(produitPointVente:Produitpointvente){
  return this.httpclient.post<any>(environment.backend_url_Product+"updateProduitProintVente",produitPointVente,{ headers: this.header });

}
}
