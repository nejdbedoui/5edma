import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Session } from '../../../model/Session';

@Injectable({
  providedIn: 'root'
})
export class SessionEndPointService {

  constructor(private httpclient:HttpClient) { }

  header = new HttpHeaders(
    {'Access-Control-Allow-Origin' : '*',
      'Content-type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT'}
);

GetSessionByDateAndIdPv(pointVenteID:string,date:string,enddate?:string){
  if(enddate!=null){
    return this.httpclient.post<any>(environment.backend_url_Pos+"GetSessionByDateAndIdPv/?date=" + date +"&datefin="+enddate+"&pointVenteId=" + pointVenteID, null,{ headers: this.header });
  }else{
    return this.httpclient.post<any>(environment.backend_url_Pos+"GetSessionByDateAndIdPv/?date=" + date +"&pointVenteId=" + pointVenteID, null,{ headers: this.header });
  }
}

closeSession(sessionId : string){
  return this.httpclient.post<any>(environment.backend_url_Pos+"closeSession/"+sessionId,null,{ headers: this.header });
}
}
