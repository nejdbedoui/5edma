import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerEndPointService } from '../../../service/bp-api-customer/customer-end-point/customer-end-point.service';
import {Notification} from "../../../model/Notification";
import {ImagesNotif} from "../../../model/ImagesNotif";
import {NotificationEndPointService} from "../../../service/bp-api-notification/notification-end-point/notification-end-point.service";
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { FileEndPointService } from '../../../service/bp-api-admin/file-end-point/file-end-point.service';
import { DateService } from '../../../service/GlobalService/DateSevice/date.service';
import { environment } from '../../../../environments/environment';
import { NotificationSendDto } from '../../../model/dto/NotificationSendDto';
import { GlobalServiceService } from '../../../service/GlobalService/global-service.service';
import { GroupeClientPartenaire } from '../../../model/GroupeClientPartenaire';
import { GroupeClientPartenaireEndPointService } from '../../../service/bp-api-customer/groupe-client-partenaire-end-point/groupe-client-partenaire-end-point.service';
import { Clientpartenaire } from '../../../model/Clientpartenaire';
import { MvtSoldeEndPointService } from '../../../service/bp-api-product/mvt-solde-end-point/mvt-solde-end-point.service';
import { clientPartnerDto } from '../../../model/ClientPartnerDto';
import * as XLSX from 'xlsx';
import { Client } from '../../../model/Client';
import { ClientImportedDto } from '../../../model/dto/ClientImportedDto';
import * as uuid from 'uuid';

@Component({
  selector: 'ngx-gestion-clients',
  templateUrl: './gestion-clients.component.html',
  styleUrls: ['./gestion-clients.component.scss']
})
export class GestionClientsComponent implements OnInit {

  constructor(private router:Router,private _CustomerEndPointService:CustomerEndPointService,
    private _FormBuilder:FormBuilder,private _DateService:DateService ,private _NotificationEndPointService:NotificationEndPointService,private _FileEndPointService:FileEndPointService,
    private _GlobalService:GlobalServiceService,
    private _GroupeClientPartenaireEndPointService:GroupeClientPartenaireEndPointService,
    private _MvtSoldeEndPointService:MvtSoldeEndPointService) { }

  loading:boolean=true
  sortOptions: any[];

    sortKey: string;

    sortField: string;
    diplayclient:boolean=false;
    importedClients:ClientImportedDto[]=[]
    sortOrder: number;
    filevalue:any=null;
    cutomers:any[]
    createNotificationForm:FormGroup;
  partnerId:string = localStorage.getItem("partenaireid");
  isSubmitted:boolean = false;
  loading2:boolean=false;
  typeNotification:string[]=['anniversaire','promotion','produit', 'remise' ];
  isDateChecked:boolean=false;
  file:string="";
  image: any;
  files:File;
  imageurl:string='';
  notification:Notification = new Notification();
  isSlider:boolean = false;
  displynotif:boolean=false;
  clientForm:FormGroup
  isSubmitted2:boolean=false
  groupes:GroupeClientPartenaire[]=[]
  datecreation:Date
  public calendar: any;
  calendar_fr = {
    closeText: "Fermer",
    prevText: "Précédent",
    nextText: "Suivant",
    currentText: "Aujourd'hui",
    monthNames: [ "janvier", "février", "mars", "avril", "mai", "juin",
      "juillet", "août", "septembre", "octobre", "novembre", "décembre" ],
    monthNamesShort: [ "janv.", "févr.", "mars", "avr.", "mai", "juin",
      "juil.", "août", "sept.", "oct.", "nov.", "déc." ],
    dayNames: [ "dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi" ],
    dayNamesShort: [ "dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam." ],
    dayNamesMin: [ "D","L","M","M","J","V","S" ],
    weekHeader: "Sem.",
    dateFormat: "dd-mm-yy",
    firstDay: 1,
    isRTL: false,
    showMonthAfterYear: false,
    yearSuffix: ""
  };
  cols3:any[]=[]
ngOnInit() {
  this.calendar=this.calendar_fr
    this.cols = [
      { field: 'nom', header: 'nom' },
      { field: 'prenom', header: 'prenom' },
      { field: 'dateCreation', header: 'dateCreation' },
      { field: 'email', header: 'email' },
      { field: 'dateCreation', header: 'dateCreation' },
      { field: 'email', header: 'email' },
      { field: 'email', header: 'email' },
      { field: 'nTel', header: 'nTel' }

  ];
  this.cols3=[
    { field: 'nom', header: 'nom' },
    { field: 'prenom', header: 'prenom' },
    { field: 'dateCreation', header: 'dateCreation' },
    { field: 'dateCreation', header: 'dateCreation' }
  ]
  this._GroupeClientPartenaireEndPointService.findAllByIdPartenaireOrderByDateCreationDesc(localStorage.getItem("partenaireid")).subscribe(val=>{
    this.groupes=val.objectResponse!=null?val.objectResponse:[]
  })
  this.clientForm=this._FormBuilder.group({
    nom  :['',[Validators.required]],
    prenom  :['',[Validators.required]],
    dateNaissance  :['',[Validators.required]],
    email  :[''],
    genre:[''],
    idgroupe:[''],
    isActive: [false]
  })
  this.createNotificationForm = this._FormBuilder.group({
    titre:['',[Validators.required]],
    body:['',[Validators.required]],
    description:['',[Validators.required]],
    typeNotification:['',[Validators.required]],
    dateDebut:['',[Validators.required]],
    dateFin:['',[Validators.required]],
  })
  this._CustomerEndPointService.findAllClientByIdPartener(localStorage.getItem("partenaireid")).subscribe(val=>{
    console.log(val);
    
    if(val.result==1){
      this.cutomers=val.objectResponse
      this.cutomers=this.cutomers.sort((data1, data2) => {
        return new Date(data2.dateCreation).getTime() -new Date(data1.dateCreation).getTime()
     });
      this.loading=false
    }else{
      this.cutomers=[]
      this.loading=false
    }
  },erruer=>{
    this.cutomers=[]
    this.loading=false
  })

  }
  uploadClient(ev) {
    console.log("***************");
    this.filevalue=null
    this.importedClients=[]
    let workBook = null;
    let jsonData = null;
    const reader = new FileReader();
    const file = ev.target.files[0];
    if(file.name.endsWith(".xlsx")||file.name.endsWith(".xls")){
      reader.onload = (event) => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary' });
      jsonData = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        return initial;
      }, {});
      console.log(jsonData.Feuil1);
      let datas=jsonData.Feuil1
      let correctfile=true
      console.log(datas);
      
      datas.forEach(element => {
        let client:ClientImportedDto=new ClientImportedDto()
        client=element
        client.id=uuid.v4()
        client.idPartenaire=localStorage.getItem("partenaireid")
        this.importedClients.push(client)
      });
      if(correctfile){
        this.diplayclient=true
      }else{
        this.importedClients=[]
        this._GlobalService.showToast('danger','Erreur',"Veuillez verifier les informations du fichier excel")
      }
    }
    reader.readAsBinaryString(file);
    
  }else{
    this._GlobalService.showToast('danger','Erreur',"Veuillez Importer un fichier Excel")

  }

  }
  get formControls() { return this.createNotificationForm.controls; }
  get formclientControls() { return this.clientForm.controls; }

cols: any[];
getname(id){
  if(id!=null){
    let group:GroupeClientPartenaire=this.groupes.filter(el=>el.idGroupeClientPartenaire==id)[0]
    if(group!=null){
      return group.designation
    }else{
      return "----"

    }
  }
  return ""
}

deletesimport(client:ClientImportedDto){
  this.importedClients=this.importedClients.filter(el=>el.id!=client.id);
}

saveimported(){
  this._CustomerEndPointService.importClientAdcaisse(this.importedClients).subscribe(val=>{
    console.log(val);
    this._GlobalService.showToast('success','succès',val.errorDescription);
    this.diplayclient=false;
    this.ngOnInit();
  },erreur=>{
    this._GlobalService.showToast('danger','Erreur',"Veuillez verifier les informations du fichier excel")
  })
}

annulerClient(){

}

getcolor(id){
  if(id!=null){
    let group:GroupeClientPartenaire=this.groupes.filter(el=>el.idGroupeClientPartenaire==id)[0]
    if(group!=null){
      return group.couleur
    }else{
      return "----"

    }
  }
  return ""
}
redirect(){
  this.router.navigateByUrl("/pages/Pointvente/gestionMouvement/NouveauMouvement")
}
displyagent:boolean=false
currnetcient:any
deactive(agent){
  this.currnetcient=agent
  if(this.currnetcient.isActive!=0){
  this.displyagent=true
  }else{
    this.activagent()
  }
}

activagent(){
  console.log(this.currnetcient);
  this._CustomerEndPointService.changeStatusClientPartner(this.currnetcient.idClientPartenaire,1).subscribe(val=>{
        if(val.result==0){
       this._GlobalService.showToast('success','succès',"le client a été activé avec succés")
       this.cutomers.forEach(ee=>{
         if(ee.idClientPartenaire==this.currnetcient.idClientPartenaire){
           ee.isActive=1
         }
       })
     }else{
       this._GlobalService.showToast('danger','Erreur',val.errorDescription)
     }
   },erreur=>{
     this._GlobalService.showToast('danger','Erreur',erreur)
     
   })
  // this.currnetcient=agent
  // let userDto:UserFoUpdatedto=new UserFoUpdatedto()
  //    userDto.firstName=this.currnetcient.firstName
  //    userDto.lastName=this.currnetcient.lastName
  //    userDto.cin=this.currnetcient.cinNum
  //    userDto.otpPwd=this.currnetcient.otpPwd
  //    userDto.phone=this.currnetcient.phone
  //    userDto.adress=this.currnetcient.adress 
  //    userDto.idUser=this.currnetcient.idUser
  //    userDto.isActif=1
  //    this._UserEndPointService.updateUser(userDto).subscribe(val=>{
  //      this.loading=false
  //      console.log(val);
  //      if(val.result==0){
  //        this._GlobalService.showToast('success','succès',"l'agent a été activé avec succés")
  //        this.agents.forEach(ee=>{
  //         if(ee.idUser==this.currnetcient.idUser){
  //           ee.isActif=1
  //         }
  //       })
  //      }else{
  //        this._GlobalService.showToast('danger','Erreur',val.errorDescription)
  //      }
  //    },erreur=>{
  //      this._GlobalService.showToast('danger','Erreur',erreur)
       
  //    })
 }

 deleteagent(){
  //  this.currnetcient=agent
  console.log(this.currnetcient);
  this._CustomerEndPointService.changeStatusClientPartner(this.currnetcient.idClientPartenaire,0).subscribe(val=>{
        if(val.result==0){
       this._GlobalService.showToast('success','succès',"le client a été deactivé avec succés")
       this.cutomers.forEach(ee=>{
         if(ee.idClientPartenaire==this.currnetcient.idClientPartenaire){
           ee.isActive=0
         }
       })
     }else{

       this._GlobalService.showToast('danger','Erreur',val.errorDescription)
     }
   },erreur=>{
    this._GlobalService.showToast('danger',"Echec","Un problème de connection est survenue, Veuillez réessayer ulterieurement");
     
   })
  
  //  let userDto:UserFoUpdatedto=new UserFoUpdatedto()
  //  userDto.firstName=this.currnetcient.firstName
  //  userDto.lastName=this.currnetcient.lastName
  //  userDto.cin=this.currnetcient.cinNum
  //  userDto.otpPwd=this.currnetcient.otpPwd
  //  userDto.phone=this.currnetcient.phone
  //  userDto.adress=this.currnetcient.adress 
  //  userDto.idUser=this.currnetcient.idUser
  //  userDto.isActif=0
  //  this._UserEndPointService.updateUser(userDto).subscribe(val=>{
  //    this.loading=false
  //    console.log(val);
  //    if(val.result==0){
  //      this._GlobalService.showToast('success','succès',"l'agent a été deactivé avec succés")
  //      this.agents.forEach(ee=>{
  //        if(ee.idUser==this.currnetcient.idUser){
  //          ee.isActif=0
  //        }
  //      })
  //    }else{
  //      this._GlobalService.showToast('danger','Erreur',val.errorDescription)
  //    }
  //  },erreur=>{
  //    this._GlobalService.showToast('danger','Erreur',erreur)
     
  //  })
  

 }
currentuser:any
uuids=uuid.v4()
 createNotification(){
  this.isSubmitted = true;
  if (this.createNotificationForm.invalid){

  }else {
    this.loading2 = true;
    
    this.isDateChecked=this.checkDate(this.createNotificationForm.value.dateDebut,this.createNotificationForm.value.dateFin);
    console.log(this.isDateChecked);
    if (this.isDateChecked){
      this.loading2 = false;
    }else {
      console.log(this.createNotificationForm.value);
      this.notification = this.createNotificationForm.value;
      this.notification.isActif = 1;
      this.notification.isSlider = this.isSlider == true ? 1 : 0;
      if (this.imageurl.length != 0){
        let image:ImagesNotif = new ImagesNotif();
        image.url = this.imageurl;
        this.notification.imagesNotif = image;
      }
      this.notification.idPartenaire = this.partnerId;
      console.log(this.notification);
      this._NotificationEndPointService.createNotification(this.notification).subscribe(res => {
        if (res.result == 1){
         let notificationSendDto:NotificationSendDto=new NotificationSendDto()
         notificationSendDto.factif=1
         notificationSendDto.idClientPartner=this.currentuser.idClientPartenaire
         notificationSendDto.idNotification=res.objectResponse.idNotification
         notificationSendDto.idPartenaire=this.partnerId
         
          this._NotificationEndPointService.sendSingleNotification(notificationSendDto).subscribe(ell=>{
            console.log(ell);
            this._GlobalService.showToast('success','succès',"une notification a été avec succés")

          },erruer=>{
            this._GlobalService.showToast('danger',"Echec","Un problème de connection est survenue, Veuillez réessayer ulterieurement");
          })
          if (this.imageurl.length != 0){
            this._FileEndPointService.uplodeimage(this.files,this.uuids).subscribe(vel=>{
              console.log(vel);
            })

          }
          
        }else{

        }
        this.displynotif=false;
        this.loading2 = false;
      })
      
    }
  }
}
checkDate(date1:Date,date2:Date){
  if(this._DateService.deletezonehour(date1).getTime()>=this._DateService.deletezonehour(date2).getTime()){
    return true;
  }else{
    return false;
  }
}
onFileChange(ev) {
  console.log(ev.target.files[0]);

  this.files = ev.target.files[0];
  if(this.files.name.toLocaleLowerCase().endsWith(".png")||this.files.name.toLocaleLowerCase().endsWith(".jpg")||this.files.name.toLocaleLowerCase().endsWith(".gif")||this.files.name.toLocaleLowerCase().endsWith(".jpeg")){
    let name:String="";
    name=this.files.name;
    console.log(name);

    name=name.replace(" ","_");
    name.split(" ").forEach(vam=>{
      name=name.replace(' ',"_");
    })
    this.imageurl=environment.image_url+"/" + this.uuids+name
    const reader = new FileReader();
    reader.onload = () => {
      this.image = reader.result;
    }
    reader.readAsDataURL(this.files);
  }else{

  }

}
editclient:boolean=false
currentclient
edits(client){
this.currentclient=client
console.log(client);

this.clientForm=this._FormBuilder.group({
  nom  :[client.nom,[Validators.required]],
  prenom  :[client.prenom,[Validators.required]],
  dateNaissance  :[client.dateNaissance,[Validators.required]],
  email  :[],
  genre:[],
  idgroupe:[client.idGroupeClient!=null?this.groupes.filter(el=>el.idGroupeClientPartenaire==client.idGroupeClient)[0].idGroupeClientPartenaire:null],
  isActive: [false]
})
this.datecreation=new Date(client.dateNaissance)
this.editclient=true
}

editclientform(){
  console.log(this.currentclient);
  
console.log(this.clientForm.value);
console.log(this.datecreation);
if(this.clientForm.invalid){
  return
}else{
  console.log(this.currentclient.isActive);
  
  let clientpartenaire:Clientpartenaire=new Clientpartenaire()
  clientpartenaire.idClient=this.currentclient.idClient
  clientpartenaire.dateCreation=this.currentclient.dateCreation
  clientpartenaire.idClientPartenaire=this.currentclient.idClientPartenaire
  clientpartenaire.idGroupeClientPartenaire=this.clientForm.value.idgroupe
  clientpartenaire.idJournee=this.currentclient.idJournee
  clientpartenaire.idPartenaire=this.currentclient.idPartenaire
  clientpartenaire.isActif=this.currentclient.isActive
  clientpartenaire.nbrAlimentationFidelite=this.currentclient.nbrAlimentationFidelite
  clientpartenaire.nom=this.clientForm.value.nom
  clientpartenaire.prenom=this.clientForm.value.prenom
  clientpartenaire.qrCodePartn=this.currentclient.qrCodePartn
  clientpartenaire.soldePartn=this.currentclient.soldePartn
  clientpartenaire.password=this.currentclient.password
  clientpartenaire.isconnected=this.currentclient.isconnected

  let clientPartner:clientPartnerDto=new clientPartnerDto()
  clientPartner.idClient=this.currentclient.idClientPartenaire
  clientPartner.idGroupeClient=this.clientForm.value.idgroupe
  clientPartner.idPartenaire=localStorage.getItem("partenaireid")
  clientPartner.nom=this.currentclient.nom
  clientPartner.prenom=this.currentclient.prenom
  console.log(this.currentclient);
  
  // clientpartenaire.srcCreation=this.currentclient.
  console.log(clientPartner)
  this.loading=true
  this._CustomerEndPointService.updateClientBpriceByPartner(clientPartner).subscribe(val=>{
    console.log(val);
    if(val.result==0){
      this.cutomers.forEach(el=>{
        if(el.idClientPartenaire==clientpartenaire.idClientPartenaire){
          el.nom=clientpartenaire.nom
          el.prenom=clientpartenaire.prenom
          el.idGroupeClient=clientPartner.idGroupeClient          
        }

      })
      this.editclient=false
      this.loading=false
      this._GlobalService.showToast('success','succès',"une notification a été avec succés")
    }else{
      this.loading=false
      this._GlobalService.showToast('danger',"Echec",val.errorDescription);

    }
    

  },erruer=>{
    this.editclient=false
    this.loading=false
    this._GlobalService.showToast('danger',"Echec","Un problème de connection est survenue, Veuillez réessayer ulterieurement");
  })
}

// this._CustomerEndPointService.updateclientpatenaire()
}
displylistmvts:boolean=false
listmvts:any[]=[]
groupArrays:any[]=[]
listmvt(client){
  this._MvtSoldeEndPointService.findAllByIdClientPartenaire(client.idClientPartenaire).subscribe(val=>{
    // console.log(val);
    this.groupArrays=[]
    this.listmvts=val.objectResponse!=null?val.objectResponse:[]
    const groups = this.listmvts.reduce((groups, game) => {
      console.log(game);
      if(game.dateOperation!=null){
        var temp = new Date(game.dateOperation);
        temp.setMonth(temp.getMonth())
        const dateold = temp.getFullYear()+'-'+((temp.getMonth()<10)?'0'+temp.getMonth():temp.getMonth());
        const date = game.dateOperation.split('-')[0]+'-'+game.dateOperation.split('-')[1];
        if (!groups[date]) {
          groups[date] = 0;
        }
        // console.log(game.dateOperation);
        
        // console.log(dateold);
        
        // console.log(groups[dateold]);
        
        if(game.montant!=null){
          if(game.sens=="+"){
            groups[date]=groups[date]+game.montant
          }else{
            groups[date]=groups[date]-game.montant
          }
        }
       
        // groups[date].push(game);
      }
      
      return groups;
    }, {});

    this.groupArrays = Object.keys(groups).map((date) => {
      return {
        date,
        games: groups[date]
      };
    });
    
    //  console.log(this.groupArrays);

    this.displylistmvts=true
  })
}
}
