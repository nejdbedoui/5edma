import { environment } from './../../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TableCaisseResponse } from '../../../model/response/TableCaisseResponse';
import { TableCaisse } from '../../../model/TableCaisse';
import { OneTableCaisseResponse } from '../../../model/response/OneTableCaisseResponse';
import { TableReservationDto } from '../../../model/TableReservationDto';

@Injectable({
  providedIn: 'root'
})
export class TableCaisseEndPointService {

  constructor(private httpclient:HttpClient) { }

  header = new HttpHeaders(
    {'Access-Control-Allow-Origin' : '*',
      'Content-type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT'}
);

findAllByIdPointVente(idPointVente:string){
  return this.httpclient.get<TableCaisseResponse>(environment.backend_url_Pos+"findAllByIdPointVente/"+idPointVente,{ headers: this.header });
}

CreateTableCaisse(table:TableCaisse){
  return this.httpclient.post<OneTableCaisseResponse>(environment.backend_url_Pos+"CreateTableCaisse",table,{ headers: this.header });
}

UpdateTableCaisse(table:TableCaisse){
  return this.httpclient.put<OneTableCaisseResponse>(environment.backend_url_Pos+"CreateTableCaisse",table,{ headers: this.header });
}
findByIdTableCaisse(idTableCaisse:string){
  return this.httpclient.get<OneTableCaisseResponse>(environment.backend_url_Pos+"findByIdTableCaisse/"+idTableCaisse,{ headers: this.header });
}
DeleteTableCaisse(idTableCaisse:string){
  return this.httpclient.delete<any>(environment.backend_url_Pos+"DeleteTableCaisse/"+idTableCaisse,{ headers: this.header });
}
findfreetablebyreservation(tableReservationDto:TableReservationDto){
  return this.httpclient.post<TableCaisseResponse>(environment.backend_url_Pos+"findfreetablebyreservation",tableReservationDto,{ headers: this.header });
}
}
