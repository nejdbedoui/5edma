import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {NotificationResponse} from "../../../model/response/NotificationResponse";
import {Notification} from "../../../model/Notification";
import {OneNotificationResponse} from "../../../model/response/OneNotificationResponse";
import {NotificationSendDto} from "../../../model/dto/NotificationSendDto";

@Injectable({
  providedIn: 'root'
})
export class NotificationEndPointService {

  header = new HttpHeaders(
    {'Access-Control-Allow-Origin' : '*',
      'Content-type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT'}
  );

  constructor(private httpclient:HttpClient) { }

  findNotificationByPartenaire(partnerId:string){
    return this.httpclient.post<NotificationResponse>(environment.backend_url_Notification+"findNotificationByPartenaire?idPartenaire="+partnerId,null,{ headers: this.header });
  }

  createNotification(notifiction:Notification){
    return this.httpclient.post<OneNotificationResponse>(environment.backend_url_Notification+"createNotification",notifiction,{ headers: this.header });
  }
  updateNotification(notifiction:Notification){
    return this.httpclient.post<OneNotificationResponse>(environment.backend_url_Notification+"updateNotification",notifiction,{ headers: this.header });
  }
  findByIdNotification(idNotification:string){
    return this.httpclient.post<OneNotificationResponse>(environment.backend_url_Notification+"findByIdNotification?idNotification="+idNotification,null,{ headers: this.header });
  }
  sendMassNotification(notificationSendDto:NotificationSendDto){
    return this.httpclient.post<any>(environment.backend_url_Notification+"sendMassNotification",notificationSendDto,{ headers: this.header });
  }
  sendSingleNotification(notificationSendDto:NotificationSendDto){
    return this.httpclient.post<any>(environment.backend_url_Notification+"sendSingleNotification",notificationSendDto,{ headers: this.header });
  }
  findListClientWhoseReceiveGivenNotification(notificationId:string){
    return this.httpclient.post<any>(environment.backend_url_Notification+"findListClientWhoseReceiveGivenNotification?idNotification="+notificationId,null,{ headers: this.header });
  }
  findNotificationByPartenaireAndTypeNotification(notificationSendDto:NotificationSendDto){
    return this.httpclient.post<NotificationResponse>(environment.backend_url_Notification+"findNotificationByPartenaireAndTypeNotification",notificationSendDto,{ headers: this.header });
  }
  findListNotificationSendedForGivenClient(clientPartenaireId:string){
    return this.httpclient.post<NotificationResponse>(environment.backend_url_Notification+"findListNotificationSendedForGivenClient?idClientPartner="+clientPartenaireId,null,{ headers: this.header });
  }
}
