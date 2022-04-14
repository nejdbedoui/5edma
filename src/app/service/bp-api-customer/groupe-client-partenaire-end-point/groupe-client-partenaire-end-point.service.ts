import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { GroupeClientPartenaire } from '../../../model/GroupeClientPartenaire';

@Injectable({
  providedIn: 'root'
})
export class GroupeClientPartenaireEndPointService {

  constructor(private httpclient:HttpClient) { }

  header = new HttpHeaders(
    {'Access-Control-Allow-Origin' : '*',
      'Content-type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT'}
);

actifGroupeClientPartenaire(idgroupe,type){
  return this.httpclient.post<any>(environment.backend_url_customer+"actifGroupeClientPartenaire/"+idgroupe+"/"+type,null,{ headers: this.header });
}

CreateGroupeClientPartenaire(groupeClientPartenaire:GroupeClientPartenaire){
  return this.httpclient.post<any>(environment.backend_url_customer+"CreateGroupeClientPartenaire",groupeClientPartenaire,{ headers: this.header });
}

findAllByIdPartenaireOrderByDateCreationDesc(idpartenaire){
  return this.httpclient.get<any>(environment.backend_url_customer+"findAllByIdPartenaireOrderByDateCreationDesc/"+idpartenaire,{ headers: this.header });
}

}
