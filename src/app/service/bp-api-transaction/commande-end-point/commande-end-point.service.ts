import { Injectable } from '@angular/core';
import { CommandeResponse } from '../../../model/response/CommandeResponse';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommandeEndPointService {

  constructor(private httpclient:HttpClient) { }

  header = new HttpHeaders(
    {'Access-Control-Allow-Origin' : '*',
      'Content-type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT'}
);

findAllByIdPointVente(idpointvente:string,order:number){
  return this.httpclient.get<CommandeResponse>(environment.backend_url_Transaction+"findAllByIdPointVente/"+idpointvente+"/"+order,{ headers: this.header });
}

findAllByIdPointVenteandType(idpointvente:string,order:number,type:number){
  return this.httpclient.get<CommandeResponse>(environment.backend_url_Transaction+"findAllByIdPointVente/"+idpointvente+"/"+order+"/"+type,{ headers: this.header });
}
findAllByIdPointVenteandTypeBetween(idpointvente:string,order:number,type:number,start:string,end:string){
  return this.httpclient.get<CommandeResponse>(environment.backend_url_Transaction+"findAllByIdPointVente/date/"+idpointvente+"/"+order+"/"+type+'?start='+start+'&end='+end,{ headers: this.header });
}


AnnulerCommande(idCommande:string){
  return this.httpclient.get<CommandeResponse>(environment.backend_url_Transaction+"AnnulerCommande/"+idCommande,{ headers: this.header });
}
}
