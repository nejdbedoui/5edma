import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { MvtStock } from '../../../model/MvtStock';
import { MvtStockDto } from '../../../model/dto/mvtStockDto';

@Injectable({
  providedIn: 'root'
})
export class MvtStockEndPointService {

  constructor(private httpclient:HttpClient) { }

  header = new HttpHeaders(
    {'Access-Control-Allow-Origin' : '*',
      'Content-type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT'}
);

findTopByIdProduitProintVenteOrderByDateMvt(idProduitProintVente:string){
  return this.httpclient.get<any>(environment.backend_url_Product+"findTopByIdProduitProintVenteOrderByDateMvt/"+idProduitProintVente,{ headers: this.header });
}
findTop5ByIdProduitProintVenteOrderByDateMvt(idProduitProintVente:string){
  return this.httpclient.get<any>(environment.backend_url_Product+"findTop5ByIdProduitProintVenteOrderByDateMvt/"+idProduitProintVente,{ headers: this.header });
}
CreateMvtStock(mvt:MvtStockDto){
  return this.httpclient.post<any>(environment.backend_url_Product+"CreateMvtStock",mvt,{ headers: this.header });
}
findAllMctByIdPointVente(idPointVente:string){
  return this.httpclient.get<any>(environment.backend_url_Product+"findAllMctByIdPointVente/"+idPointVente,{ headers: this.header });

}

}
