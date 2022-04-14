import { environment } from './../../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ModeReglementResponse } from '../../../model/response/ModeReglementResponse';
import { ModeReglement } from '../../../model/ModeReglement';
import { OneModeReglementResponse } from '../../../model/response/OneModeReglementResponse';

@Injectable({
  providedIn: 'root'
})
export class ModeReglementEndPointService {

  constructor(private httpclient:HttpClient) { }

  header = new HttpHeaders(
    {'Access-Control-Allow-Origin' : '*',
      'Content-type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT'}
);

findAllModeReglement(){
  return this.httpclient.get<ModeReglementResponse>(environment.backend_url_Pos+"findAllModeReglement",{ headers: this.header });
}
CreateModeReglement(modeReglement:ModeReglement){
  return this.httpclient.post<any>(environment.backend_url_Pos+"CreateModeReglement",modeReglement,{ headers: this.header });
}
UpdateModeReglement(modeReglement:ModeReglement){
  return this.httpclient.put<any>(environment.backend_url_Pos+"UpdateModeReglement",modeReglement,{ headers: this.header });
}
findByIdModeReglement(idModeReglement:string){
  return this.httpclient.get<OneModeReglementResponse>(environment.backend_url_Pos+"findByIdModeReglement/"+idModeReglement,{ headers: this.header });
}
DeleteModeReglement(idModeReglement:string){
  return this.httpclient.delete<any>(environment.backend_url_Pos+"DeleteModeReglement/"+idModeReglement,{ headers: this.header });
}
findAllModeReglementByIdPointVente(idModeReglement:string){
  return this.httpclient.get<ModeReglementResponse>(environment.backend_url_Pos+"findAllModeReglementByIdPointVente?idPointVente="+idModeReglement,{ headers: this.header });
}
}
