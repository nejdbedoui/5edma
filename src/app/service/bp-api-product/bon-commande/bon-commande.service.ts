import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { BonCommande } from '../../../model/BonCommande';

@Injectable({
  providedIn: 'root'
})
export class BonCommandeService {

  constructor(private httpclient:HttpClient) { }

  header = new HttpHeaders(
    {'Access-Control-Allow-Origin' : '*',
      'Content-type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT'}
);

CreateBonCommande(bonCommande: BonCommande){
  return this.httpclient.post<any>(environment.backend_url_Product+"boncommande",bonCommande,{ headers: this.header });
}

findAllByIdpartenaire(idpv: string) {
  return this.httpclient.get<any>(environment.backend_url_Product+"boncommande/findAllByIdpartenaire/"+idpv,{ headers: this.header });
}

findAllByIdPointVente(idpv: string) {
  return this.httpclient.get<any>(environment.backend_url_Product+"boncommande/findAllByIdPointVente/"+idpv,{ headers: this.header });
}

findAllByBonCommandeList(bonCommandesId: Array<string>){
  return this.httpclient.post<any>(environment.backend_url_Product+"boncommande/ids",bonCommandesId,{ headers: this.header });
}

}
