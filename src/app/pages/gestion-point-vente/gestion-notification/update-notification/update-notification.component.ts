import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Notification} from "../../../../model/Notification";
import {DateService} from "../../../../service/GlobalService/DateSevice/date.service";
import {NotificationEndPointService} from "../../../../service/bp-api-notification/notification-end-point/notification-end-point.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ImagesNotif} from "../../../../model/ImagesNotif";
import {environment} from "../../../../../environments/environment";
import {GlobalServiceService} from "../../../../service/GlobalService/global-service.service";
import {FileEndPointService} from "../../../../service/bp-api-admin/file-end-point/file-end-point.service";
import * as uuid from 'uuid';

@Component({
  selector: 'ngx-update-notification',
  templateUrl: './update-notification.component.html',
  styleUrls: ['./update-notification.component.scss']
})
export class UpdateNotificationComponent implements OnInit {

  createNotificationForm:FormGroup;
  partnerId:string = localStorage.getItem("partenaireid");
  isSubmitted:boolean = false;
  loading:boolean=false;
  typeNotification:string[]=['anniversaire','promotion','produit', 'remise','info' ];
  isDateChecked:boolean=false;
  file:string="";
  image: any;
  files:File;
  imageurl:string='';
  notification:Notification = new Notification();
  id:string = this.route.snapshot.paramMap.get('id');
  isSlider:boolean = false;
  showpopup:boolean=false;
  constructor(private _FormBuilder:FormBuilder,private _DateService:DateService ,private _NotificationEndPointService:NotificationEndPointService,private router: Router,private route:ActivatedRoute,private _FileEndPointService:FileEndPointService,private _GlobalServiceService:GlobalServiceService) { }
  uuids=uuid.v4()
  ngOnInit() {
    this.createNotificationForm = this._FormBuilder.group({
      titre:['',[Validators.required]],
      body:['',[Validators.required]],
      description:['',[Validators.required]],
      typeNotification:['',[Validators.required]],
      dateDebut:['',[Validators.required]],
      dateFin:['',[Validators.required]],
    })
    this._NotificationEndPointService.findByIdNotification(this.id).subscribe(res => {
      console.log(res);
      if (res.result == 1){
        this.notification = res.objectResponse;
        console.log(this.notification.imagesNotif);
        console.log(res.objectResponse);
        this.isSlider = this.notification.isSlider == 1 ? true : false;
        this.createNotificationForm = this._FormBuilder.group({
          titre:[this.notification.titre,[Validators.required]],
          body:[this.notification.body,[Validators.required]],
          description:[this.notification.description,[Validators.required]],
          typeNotification:[this.notification.typeNotification,[Validators.required]],
          dateDebut:[new Date(this.notification.dateDebut.toString()),[Validators.required]],
          dateFin:[new Date(this.notification.dateFin.toString()),[Validators.required]],
        })
      }
    });
  }

  get formControls() { return this.createNotificationForm.controls; }

  createNotification(){
    this.isSubmitted = true;
    if (this.createNotificationForm.invalid){

    }else {
      this.loading = true;
      this.isDateChecked=this.checkDate(this.createNotificationForm.value.dateDebut,this.createNotificationForm.value.dateFin);
      console.log(this.isDateChecked);
      if (this.isDateChecked){
        this.loading = false;
      }else {
        
        console.log(this.createNotificationForm.value);
        //this.notification = this.createNotificationForm.value;
        this.notification.dateFin = this.createNotificationForm.value.dateFin;
        this.notification.dateDebut = this.createNotificationForm.value.dateDebut;
        this.notification.description = this.createNotificationForm.value.description;
        this.notification.body = this.createNotificationForm.value.body;
        this.notification.typeNotification = this.createNotificationForm.value.typeNotification;
        this.notification.titre = this.createNotificationForm.value.titre;
        this.notification.isSlider = this.isSlider == true ? 1 : 0;
        this.notification.isActif = 1;
        if (this.imageurl.length != 0){
          let image:ImagesNotif = new ImagesNotif();
          image.url = this.imageurl;
          this.notification.imagesNotif = image;
        }
        this.notification.idPartenaire = this.partnerId;
        console.log(this.notification);
        this._NotificationEndPointService.updateNotification(this.notification).subscribe(res => {
          if (res.result == 0){
            if (this.imageurl.length != 0){
              this._FileEndPointService.uplodeimage(this.files,this.uuids).subscribe(vel=>{
                console.log(vel);
              })
            }
            return this.router.navigateByUrl("/pages/Pointvente/gestionNotification");
          }else {
            this._GlobalServiceService.showToast('danger',"Erreur",res.errorDescription);
          }
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

}
