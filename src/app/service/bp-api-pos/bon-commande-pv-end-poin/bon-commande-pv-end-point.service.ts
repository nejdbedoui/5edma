import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { BonCommandePv } from '../../../model/BonCommandePv';
import { CommandePv } from '../../../model/CommandePv';
import { DetailCommandePv } from '../../../model/DetailCommandePv';
import { BonCommandePvResponse } from '../../../model/response/BonCommandePvResponse';
import { DetailCommandePvResponse } from '../../../model/response/DetailCommandePvResponse';

@Injectable({
  providedIn: 'root'
})
export class BonCommandePvEndPointService {
  

  header = new HttpHeaders(
    {'Access-Control-Allow-Origin' : '*',
      'Content-type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT'}
);

  constructor(private httpclient:HttpClient) { }

  findAllBonCommandePvByIdPointVente(idPointvente:String){
    return this.httpclient.get<any>(environment.backend_url_Pos+"findAllBonByidPointVente/"+idPointvente,{ headers: this.header });  }
    


    findByIdBonCommandeAllCommandes(idBonCommande:String){
      return this.httpclient.get<any>(environment.backend_url_Pos+"findAllCommandePVByidBonCommande/"+idBonCommande,{ headers: this.header }); 
    }

    findByIdCommandeAllDetailCommande(idDetailCommande:String){
      return this.httpclient.get<any>(environment.backend_url_Pos+"findAllDetailCommandePVByidCommande/"+idDetailCommande,{ headers: this.header }); 
    }

    createBonCommandePv(bonCommandePv: BonCommandePv) {
      return this.httpclient.post<BonCommandePvResponse>(environment.backend_url_Pos+"CreateBonCommandePV/",bonCommandePv,{ headers: this.header });
    }
    deleteBonCommande(id:String){
      return this.httpclient.delete<any>(environment.backend_url_Pos+"DeleteBonCommande/"+id,{ headers: this.header });
  
    }
    updateBonCommande(bonCommandePv:BonCommandePv){
      return this.httpclient.put<BonCommandePvResponse>(environment.backend_url_Pos+"UpdateBonCommandePv/",bonCommandePv,{ headers: this.header });
    }
    createCommande(Commande: CommandePv){
      return this.httpclient.post<any>(environment.backend_url_Pos+"CreateCommandePV/",Commande,{ headers: this.header });  
    }
    createListeDetailsCommandes(detailCommandes: DetailCommandePv[]){
      return this.httpclient.post<any>(environment.backend_url_Pos+"CreateDetailCommandePVFromArray/",detailCommandes,{ headers: this.header });  
    }
    updateDetailCommande(detailCommande:DetailCommandePv){
      return this.httpclient.put<any>(environment.backend_url_Pos+"UpdateDetailCommande/",detailCommande,{ headers: this.header });

    }
    createDetailCommandePv(detailCommande:DetailCommandePv){
      return this.httpclient.post<DetailCommandePvResponse>(environment.backend_url_Pos+"CreateDetailCommandePV/",detailCommande,{ headers: this.header });
    }
    deleteDetailCommande(idDetail: String) {
      return this.httpclient.delete<any>(environment.backend_url_Pos+"DeleteDetailCommandePV/"+idDetail,{ headers: this.header });
    }

    deleteCommande(idCommande: String) {
      return this.httpclient.delete<any>(environment.backend_url_Pos+"DeleteCommandePV/"+idCommande,{ headers: this.header });
    }
    findByIdBonCommandePv(idBonCommande: string) {
      return this.httpclient.get<any>(environment.backend_url_Pos+"findByIdBonCommande/"+idBonCommande,{ headers: this.header }); 

    }

    findAllBonCommandePv(){
      return this.httpclient.get<any>(environment.backend_url_Pos+"findallBonCommandePv/",{ headers: this.header });  }
    
    updateCommande(commande:CommandePv){
      return this.httpclient.put<any>(environment.backend_url_Pos+"UpdateCommandepv/",commande,{ headers: this.header });
    }
  }
 
   

