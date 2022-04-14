import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ReservationDto } from '../../model/dto/ReservationDto';
import { ReservationResponse } from '../../model/response/ReservationResponse';

@Injectable({
  providedIn: 'root'
})
export class BpApiReservationService {

  constructor(private httpclient:HttpClient) { }

  header = new HttpHeaders(
    {'Access-Control-Allow-Origin' : '*',
      'Content-type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT'}
);

findReservationByStatusAndIdPointVente(reservation:ReservationDto){
  return this.httpclient.post<any>(environment.backend_url_Reservation+"findReservationByStatusAndIdPointVente/",reservation,{ headers: this.header });
}

createReservation(reservation:ReservationDto){
  return this.httpclient.post<any>(environment.backend_url_Reservation+"createReservation",reservation,{ headers: this.header });
}
updateReservation(reservation:ReservationDto){
  return this.httpclient.post<any>(environment.backend_url_Reservation+"updateReservation",reservation,{ headers: this.header });
}

treatOrCancelReservation(reservation:ReservationDto){
  return this.httpclient.post<any>(environment.backend_url_Reservation+"treatOrCancelReservation",reservation,{ headers: this.header });
}

findReservationById(id:String){
  return this.httpclient.post<any>(environment.backend_url_Reservation+"findReservationById/"+id,null,{ headers: this.header });

}
}
