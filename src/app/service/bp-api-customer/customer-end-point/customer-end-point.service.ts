import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Utilisateur } from '../../../model/Utilisateur';
import { OneUtilisateurResponse } from '../../../model/response/OneUtilisateurResponse';
import { environment } from '../../../../environments/environment';
import { SearchClientDto } from '../../../model/dto/SearchClientDto';
import { Clientpartenaire } from '../../../model/Clientpartenaire';
import { clientPartnerDto } from '../../../model/ClientPartnerDto';
import { Client } from '../../../model/Client';
import { ClientImportedDto } from '../../../model/dto/ClientImportedDto';

@Injectable({
  providedIn: 'root'
})
export class CustomerEndPointService {

  constructor(private httpclient:HttpClient) { }

  header = new HttpHeaders(
    {'Access-Control-Allow-Origin' : '*',
      'Content-type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT'}
);

searchClientbyIdPartenaire(client:SearchClientDto){
  return this.httpclient.post<any>(environment.backend_url_customer+"searchClientbyIdPartenaire",client,{ headers: this.header });
}
findAllActiveClientByPartenaire(idPartenaire:string){
  return this.httpclient.get<any>(environment.backend_url_customer+"findAllActiveClientByPartenaire/"+idPartenaire,{ headers: this.header });
}
  findAllActiveAndConnectedClientByPartenaire(idPartenaire:string){
    return this.httpclient.get<any>(environment.backend_url_customer+"findAllActiveAndConnectedClientByPartenaire/"+idPartenaire,{ headers: this.header });
  }

  changeStatusClientPartner(idClient:string,isActif:number){
    return this.httpclient.post<any>(environment.backend_url_customer+"changeStatusClientPartner/"+idClient+"/"+"/"+isActif,null,{ headers: this.header });

  }
  findAllClientByIdPartener(idPartenaire:string){
    return this.httpclient.post<any>(environment.backend_url_customer+"findAllClientByIdPartener/"+idPartenaire,{ headers: this.header });
  }
  findAllByIdPartenaireAndIsActifAndIdGroupeClientPartenaire(idPartenaire,idgroupe){
    return this.httpclient.get<any>(environment.backend_url_customer+"findAllByIdPartenaireAndIsActifAndIdGroupeClientPartenaire/"+idPartenaire+"/"+idgroupe,{ headers: this.header });
  }
  affecteclienttogroupe(idclient,idgroupe){
    return this.httpclient.get<any>(environment.backend_url_customer+"affecteclienttogroupe/"+idclient+"/"+idgroupe,{ headers: this.header });
  }

  // updateclientpatenaire(clientpartenaire:Clientpartenaire){
  //   return this.httpclient.post<any>(environment.backend_url_customer+"updateclientpatenaire",clientpartenaire,{ headers: this.header });

  // }
  updateClientBpriceByPartner(clientPartnerDto:clientPartnerDto){
    return this.httpclient.post<any>(environment.backend_url_customer+"updateClientBpriceByPartner",clientPartnerDto,{ headers: this.header });
  }

  importClientAdcaisse(clients:ClientImportedDto[]){
    return this.httpclient.post<any>(environment.backend_url_customer+"importClientAdcaisse",clients,{ headers: this.header });
  }
}
