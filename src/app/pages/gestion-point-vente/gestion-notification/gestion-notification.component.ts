import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {Notification} from "../../../model/Notification";
import {NotificationEndPointService} from "../../../service/bp-api-notification/notification-end-point/notification-end-point.service";
import {Clientpartenaire} from "../../../model/Clientpartenaire";
import {CustomerEndPointService} from "../../../service/bp-api-customer/customer-end-point/customer-end-point.service";
import {PointVenteEndPointService} from "../../../service/bp-api-pos/point-vente-end-point/point-vente-end-point.service";
import {GlobalServiceService} from "../../../service/GlobalService/global-service.service";
import {NotificationSendDto} from "../../../model/dto/NotificationSendDto";
import { GroupeClientPartenaire } from '../../../model/GroupeClientPartenaire';
import { GroupeClientPartenaireEndPointService } from '../../../service/bp-api-customer/groupe-client-partenaire-end-point/groupe-client-partenaire-end-point.service';


@Component({
  selector: 'ngx-gestion-notification',
  templateUrl: './gestion-notification.component.html',
  styleUrls: ['./gestion-notification.component.scss']
})
export class GestionNotificationComponent implements OnInit {

  partnerId:string = localStorage.getItem("partenaireid");
  loading:boolean=true;
  cols: any[];
  cols2: any[];
  notifications:Notification[]=[];
  clientPartenaires:Clientpartenaire[]=[];
  showClient:boolean = false;
  showClientNotif:boolean = false;
  showNotifClient:boolean = false;
  selectedClient:Clientpartenaire[]=[];
  selectedgroupe:GroupeClientPartenaire[]=[]
  groupes:GroupeClientPartenaire[]=[]
  selectedNotif:Notification = new Notification();
  clientPartenairesNotif:Clientpartenaire[]=[];
  clientNotifications:Notification[]=[];



  constructor( private router:Router, private _NotificationEndPointService:NotificationEndPointService, 
    private _CustomerEndPointService:CustomerEndPointService,private _GlobalServiceService:GlobalServiceService,
    private _GroupeClientPartenaireEndPointService:GroupeClientPartenaireEndPointService) { }
    cols3:any[]=[]
  ngOnInit() {
    this.cols = [
      { field: 'titre', header: 'Titre' },
      { field: 'body', header: 'Body' },
      { field: 'description', header: 'Description' },
      { field: 'typeNotification', header: 'Type de Notification' },
      { field: 'dateCreation', header: 'Date de Creation' },
      { field: 'isActif', header: 'Statut' },
      { field: 'Action', header: 'Action' }
    ];

    this.cols2 = [
      { field: 'nom', header: 'Nom' },
      { field: 'prenom', header: 'Prenom' },
      { field: 'email', header: 'Email' },
      { field: 'Action', header: 'Action' }
    ];

    this.cols3=[
      { field: 'nom', header: 'Nom' },
      { field: 'prenom', header: 'Prenom' }
    ]
    this.cols2 = [
      { field: 'nom', header: 'Nom' },
      { field: 'prenom', header: 'Prenom' },
      { field: 'isActif', header: 'Status' },
    ];
    
    // this._NotificationEndPointService.findNotificationByPartenaire(this.partnerId).subscribe(res => {
    //   if (res.result == 1){
    //     this.loading = false;
    //     this.notifications = res.objectResponse;
    //   }else if (res.result == 0) {
    //     this.loading = false;
    //   }else {
    //     this.loading = true;
    //   }
    // })
    this.findNotificationByPartenaireAndTypeNotification();

    this._CustomerEndPointService.findAllActiveAndConnectedClientByPartenaire(this.partnerId).subscribe(res =>{
      console.log(res);
      
      if (res.result == 1){
        this.clientPartenaires = res.objectResponse;
      }
    })

    this._GroupeClientPartenaireEndPointService.findAllByIdPartenaireOrderByDateCreationDesc(this.partnerId).subscribe(val=>{
        this.groupes=val.objectResponse!=null?val.objectResponse:[]
        this.groupes=this.groupes.filter(el=>el.isActif==1)
    })
    
  }

  redirect(){
    this.router.navigateByUrl("/pages/Pointvente/gestionNotification/NouvelleNotification")
  }

  // checkClient(client){
  //  if (this.selectedClient.indexOf(client) == -1){
  //    this.selectedClient.push(client);
  //  }else{
  //    this.selectedClient = this.selectedClient.filter(value => value.idClient != client.idClient);
  //  }
  //  console.log(this.selectedClient);
  // }

  sendNotification(){
    if (this.selectedClient.length > 0){
      console.log(this.selectedClient.length);
      
      if (this.selectedClient.length > 1 && this.selectedClient.length != this.clientPartenaires.length){
        let notificationSendDto:NotificationSendDto = new NotificationSendDto();
        notificationSendDto.idNotification = this.selectedNotif.idNotification;
        notificationSendDto.sendToAll = '0';
        notificationSendDto.idPartenaire = this.partnerId;
        this.selectedClient.forEach(value => {notificationSendDto.listIdClientPartner.push(value.idClientPartenaire);});
        console.log(notificationSendDto);
        this.sendMassNotification(notificationSendDto);
      }else if (this.selectedClient.length == 1) {
        let notificationSendDto:NotificationSendDto = new NotificationSendDto();
        notificationSendDto.idNotification = this.selectedNotif.idNotification;
        notificationSendDto.idPartenaire = this.partnerId;
        notificationSendDto.idClientPartner = this.selectedClient[0].idClientPartenaire;
        //notificationSendDto.listIdClientPartner.push(this.selectedClient[0].idClient);
        console.log(notificationSendDto);
        this.sendSingleNotification(notificationSendDto);
      }else if (this.selectedClient.length == this.clientPartenaires.length) {
        let notificationSendDto:NotificationSendDto = new NotificationSendDto();
        notificationSendDto.idNotification = this.selectedNotif.idNotification;
        notificationSendDto.sendToAll = '1';
        notificationSendDto.idPartenaire = this.partnerId;
        console.log(notificationSendDto);
        this.sendMassNotification(notificationSendDto);
      }
    }else if(this.selectedgroupe.length>0){
        let i :number=0
        this.selectedgroupe.forEach(element=>{
          i++
          if(element!=null){
            this._CustomerEndPointService.findAllByIdPartenaireAndIsActifAndIdGroupeClientPartenaire(this.partnerId,element.idGroupeClientPartenaire).subscribe(vel=>{
              if(vel.objectResponse!=null){
                vel.objectResponse.forEach(element => {
                  this.selectedClient.push(element)
                });
                
                console.log(this.selectedClient);
                if(i==this.selectedgroupe.length){
                  this.sendNotification()
                }
              }
              
            })
          }
          
        })
    }else{
      this._GlobalServiceService.showToast('danger','Alerte',"Veuillez choisir au moins un client");
    }
  }
  sendMassNotification(notificationSendDto:NotificationSendDto){
    console.log(notificationSendDto);
    
    this._NotificationEndPointService.sendMassNotification(notificationSendDto).subscribe(res =>{
      console.log(res);
      if (res.result == 1){
        this.showClient = false;
        this.selectedClient = [];
        this._GlobalServiceService.showToast('success','Succès',"Notification envoyée");
      }
    });
  }
  sendSingleNotification(notificationSendDto:NotificationSendDto){
    this._NotificationEndPointService.sendSingleNotification(notificationSendDto).subscribe(res =>{
      console.log(res);
      if (res.result == 1){
        this.showClient = false;
        this.selectedClient = [];
        this._GlobalServiceService.showToast('success','Succès',"Notification envoyée");
      }
    });
  }
  findListClientWhoseReceiveGivenNotification(notificationId:string){
    this._NotificationEndPointService.findListClientWhoseReceiveGivenNotification(notificationId).subscribe(res =>{
      console.log(res);
      this.clientPartenairesNotif = res.objectResponse;
      this.showClientNotif = true;
    })
  }
  findNotificationByPartenaireAndTypeNotification(){
    let notificationSendDto:NotificationSendDto = new NotificationSendDto();
    notificationSendDto.listType = ['anniversaire','promotion','produit', 'remise','info' ];
    notificationSendDto.idPartenaire = this.partnerId;
    this._NotificationEndPointService.findNotificationByPartenaireAndTypeNotification(notificationSendDto).subscribe(res =>{
      this.loading=false
      if (res.result == 1){
        this.loading = false;
        this.notifications = res.objectResponse;
      }
    })
  }
  findListNotificationSendedForGivenClient(clientPartenaireId:string){
    this._NotificationEndPointService.findListNotificationSendedForGivenClient(clientPartenaireId).subscribe(res => {
      if (res.result == 1){
        this.clientNotifications = res.objectResponse;
        this.loading = false;
      }else {
        this.loading = false;
      }
    })
  }
}
