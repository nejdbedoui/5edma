import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {AnalyticsResponceCA} from "../../../model/response/AnalyticsResponceCA";
import {AnalyticsResponce} from "../../../model/response/AnalyticsResponce";
import {AnalyticsResponceCAPeriod} from "../../../model/response/AnalyticsResponceCAPeriod";

@Injectable({
  providedIn: 'root'
})
export class PartnerAnalyticsEndPointService {

  header = new HttpHeaders(
    {'Access-Control-Allow-Origin' : '*',
      'Content-type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT'}
  );

  constructor(private httpclient:HttpClient) { }

  getCAByDay(pointVenteID:string,caisseId:string,date:string,enddate?:string){
    if(enddate!=null){
      if (caisseId != null){
        return this.httpclient.post<AnalyticsResponceCA>(environment.backend_url_Analytics+"getCAByDay?caisseId="+caisseId+"&date="+date+"&datefin="+enddate+"&pointVenteId="+pointVenteID,null,{ headers: this.header });
      }else {
        return this.httpclient.post<AnalyticsResponceCA>(environment.backend_url_Analytics+"getCAByDay?date="+date+"&datefin="+enddate+"&pointVenteId="+pointVenteID,null,{ headers: this.header });
      }
    }else{
      if (caisseId != null){
        return this.httpclient.post<AnalyticsResponceCA>(environment.backend_url_Analytics+"getCAByDay?caisseId="+caisseId+"&date="+date+"&pointVenteId="+pointVenteID,null,{ headers: this.header });
      }else {
        return this.httpclient.post<AnalyticsResponceCA>(environment.backend_url_Analytics+"getCAByDay?date="+date+"&pointVenteId="+pointVenteID,null,{ headers: this.header });
      }
    }
    
  }
  getNbrTicket(pointVenteID:string,date:string,partnerId:string,enddate?:string){
    if(enddate!=null){
      if (pointVenteID != null) {
        return this.httpclient.post<AnalyticsResponce>(environment.backend_url_Analytics + "getNbrTicket?date=" + date +"&datefin="+enddate+"&pointVenteId=" + pointVenteID, null, {headers: this.header});
      }else {
        return this.httpclient.post<AnalyticsResponce>(environment.backend_url_Analytics + "getNbrTicket?date=" + date +"&datefin="+enddate+ "&partnerId=" + partnerId, null, {headers: this.header});
      }
    }else{
      if (pointVenteID != null) {
        return this.httpclient.post<AnalyticsResponce>(environment.backend_url_Analytics + "getNbrTicket?date=" + date + "&pointVenteId=" + pointVenteID, null, {headers: this.header});
      }else {
        return this.httpclient.post<AnalyticsResponce>(environment.backend_url_Analytics + "getNbrTicket?date=" + date + "&partnerId=" + partnerId, null, {headers: this.header});
      }
    }
    
  }
  getNbrClientPassageGlobalByPartnerAndPV(pointVenteID:string,partnerId:string){
    if (pointVenteID != null) {
      return this.httpclient.post<AnalyticsResponce>(environment.backend_url_Analytics+"getNbrClientPassageGlobalByPartnerAndPV?pointVenteId="+pointVenteID,null,{ headers: this.header });
    }else {
      return this.httpclient.post<AnalyticsResponce>(environment.backend_url_Analytics+"getNbrClientPassageGlobalByPartnerAndPV?partnerId="+partnerId,null,{ headers: this.header });
    }
  }
  getNbrClientPassageForDayByPartnerAndPV(pointVenteID:string,partnerId:string,date:string){
    if (pointVenteID != null) {
      return this.httpclient.post<AnalyticsResponce>(environment.backend_url_Analytics+"getNbrClientPassageForDayByPartnerAndPV?pointVenteId="+pointVenteID+"&startDate="+date,null,{ headers: this.header });
    }else {
      return this.httpclient.post<AnalyticsResponce>(environment.backend_url_Analytics+"getNbrClientPassageForDayByPartnerAndPV?partnerId="+partnerId+"&startDate="+date,null,{ headers: this.header });
    }
  }
  getNbrClientPassageByPeriodeAndPartnerAndPV(pointVenteID:string,partnerId:string,startdate:string,enddate:string){
    if (pointVenteID != null) {
      return this.httpclient.post<AnalyticsResponce>(environment.backend_url_Analytics+"getNbrClientPassageByPeriodeAndPartnerAndPV?endDate="+enddate+"&pointVenteId="+pointVenteID+"&startDate="+startdate,null,{ headers: this.header });
    }else {
      return this.httpclient.post<AnalyticsResponce>(environment.backend_url_Analytics+"getNbrClientPassageByPeriodeAndPartnerAndPV?endDate="+enddate+"&startDate="+startdate,null,{ headers: this.header });
    }
  }

  getListCAdepanceByPVAndDate(pointVenteID:string,startdate:string,enddate:string){
    if (enddate != null) {
      return this.httpclient.post<any>(environment.backend_url_Analytics+"getListCAdepanceByPVAndDate?date="+startdate+"&datefin="+enddate+"&pointVenteId="+pointVenteID,null,{ headers: this.header });
    }else {
      return this.httpclient.post<any>(environment.backend_url_Analytics+"getListCAdepanceByPVAndDate?date="+startdate+"&pointVenteId="+pointVenteID,null,{ headers: this.header });
    }
  }
  getNbrNewClientForDay(pointVenteID:string,partnerId:string,date:string){
    if (pointVenteID != null) {
      return this.httpclient.post<AnalyticsResponce>(environment.backend_url_Analytics + "getNbrNewClientForDay?date=" + date + "&partnerId=" + partnerId + "&pointVenteId=" + pointVenteID, null, {headers: this.header});
    }else {
      return this.httpclient.post<AnalyticsResponce>(environment.backend_url_Analytics + "getNbrNewClientForDay?date=" + date + "&partnerId=" + partnerId , null, {headers: this.header});
    }
  }

  getNbrNewClientForPeriode(pointVenteID:string,partnerId:string,startdate:string,endDate:string){
    if (pointVenteID != null) {
      return this.httpclient.post<AnalyticsResponce>(environment.backend_url_Analytics + "getNbrNewClientForPeriode?endDate=" + endDate + "&partnerId=" + partnerId + "&pointVenteId=" + pointVenteID+"&startDate=" + startdate , null, {headers: this.header});
    }else {
      return this.httpclient.post<AnalyticsResponce>(environment.backend_url_Analytics + "getNbrNewClientForPeriode?endDate=" + endDate + "&partnerId=" + partnerId+"&startDate=" + startdate  , null, {headers: this.header});
    }
  }
  getListEvolCAByPeriode(pointVenteID:string,sDate:string,eDate:string){
    return this.httpclient.post<AnalyticsResponceCAPeriod>(environment.backend_url_Analytics+"getListEvolCAByPeriode?endDate="+eDate+"&pointVenteId="+pointVenteID+"&startDate="+sDate,null,{ headers: this.header });
  }
  getListEvolCAByMonth(pointVenteID:string,year:string){
    return this.httpclient.post<any>(environment.backend_url_Analytics+'getListEvolCAByMonth?pointVenteId='+pointVenteID+'&year='+year,null,{ headers: this.header });
  }
  getListEvolCAInDay(pointVenteID:string,date:string){
    return this.httpclient.post<any>(environment.backend_url_Analytics+'getListEvolCAInDay?pointventeId='+pointVenteID+'&startDate='+date,null,{ headers: this.header });
  }
  getCAByDayByPartner(partnerId:string,date:string){
    return this.httpclient.post<any>(environment.backend_url_Analytics+"getCAByDayByPartner?startDate="+date+"&partnerId="+partnerId,null,{ headers: this.header });
  }
  getListEvolCAByMonthByPartner(partnerId:string,year:string){
    return this.httpclient.post<any>(environment.backend_url_Analytics+'getListEvolCAByMonthByPartner?partnerId='+partnerId+'&year='+year,null,{ headers: this.header });
  }
  getListEvolCAByPeriodeByPartner(partnerId:string,sDate:string,eDate:string){
    return this.httpclient.post<AnalyticsResponceCAPeriod>(environment.backend_url_Analytics+"getListEvolCAByPeriodeByPartner?endDate="+eDate+"&partnerId="+partnerId+"&startDate="+sDate,null,{ headers: this.header });
  }
  getListEvolCAInDayByPartner(partnerId:string,date:string){
    return this.httpclient.post<any>(environment.backend_url_Analytics+'getListEvolCAInDayByPartner?partnerId='+partnerId+'&startDate='+date,null,{ headers: this.header });
  }
  getProductCAByPv(pointVenteID:string,date:string,datefin?:string){
    if(datefin!=null){
      return this.httpclient.post<any>(environment.backend_url_Analytics+'getProductCAByPv?date='+date+'&dateFin='+datefin+'&pvId='+pointVenteID,null,{ headers: this.header });
    }else{
      return this.httpclient.post<any>(environment.backend_url_Analytics+'getProductCAByPv?date='+date+'&pvId='+pointVenteID,null,{ headers: this.header });
    }
  }

  getListCAPacktByPVAndDate(pointVenteID:string,date:string,datefin?:string){
    if(datefin!=null){
      return this.httpclient.post<any>(environment.backend_url_Analytics+'getListCAPacktByPVAndDate?date='+date+'&dateFin='+datefin+'&pvId='+pointVenteID,null,{ headers: this.header });
    }else{
      return this.httpclient.post<any>(environment.backend_url_Analytics+'getListCAPacktByPVAndDate?date='+date+'&pvId='+pointVenteID,null,{ headers: this.header });

    }
  }

  getListCAEmployeByPVAndDate(pointVenteID:string,date:string,datefin?:string){
    if(datefin!=null){
      return this.httpclient.post<any>(environment.backend_url_Analytics+'getListCAEmployeByPVAndDate?date='+date+'&dateFin='+datefin+'&pvId='+pointVenteID,null,{ headers: this.header });
    }else{
      return this.httpclient.post<any>(environment.backend_url_Analytics+'getListCAEmployeByPVAndDate?date='+date+'&pvId='+pointVenteID,null,{ headers: this.header });
    }
  }
}
