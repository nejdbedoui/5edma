import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Facture } from '../../../model/Facture';

@Injectable({
  providedIn: 'root'
})
export class FactureService {

  constructor(private httpclient: HttpClient) { }

  CreateFacture(facture: Facture) {
    return this.httpclient.post<any>(environment.backend_url_Product + "facture", facture);
  }

  patchFactureAsPayed(idFacture: string) {
    return this.httpclient.patch<any>(environment.backend_url_Product + "facture/" + idFacture, null);
  }

  DeleteFacture(idFacture: string) {
    return this.httpclient.delete<any>(environment.backend_url_Product + "facture/" + idFacture);
  }

  findByIdpartenaire(idpartenaire: string) {
    return this.httpclient.get<any>(environment.backend_url_Product + "facture/partenaire/" + idpartenaire);
  }
}
