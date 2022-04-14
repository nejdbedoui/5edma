import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Utilisateur } from '../../../model/Utilisateur';
import { UtilisateurEndPointService } from '../../../service/bp-api-admin/utilisateur-end-point/utilisateur-end-point.service';
import { GlobalServiceService } from '../../../service/GlobalService/global-service.service';
import { userInfo } from 'os';
import { DateService } from '../../../service/GlobalService/DateSevice/date.service';
import { Operation } from '../../../model/Operation';
import { OperationEndPointService } from '../../../service/bp-api-transaction/operation-end-point/operation-end-point.service';
import { OperationTypeEndPointService } from '../../../service/bp-api-transaction/operation-type-end-point/operation-type-end-point.service';
import { OperationType } from '../../../model/OperationType';

@Component({
  selector: 'ngx-gestion-employes',
  templateUrl: './gestion-employes.component.html',
  styleUrls: ['./gestion-employes.component.scss']
})
export class GestionEmployesComponent implements OnInit {

  constructor(private route:Router,private _UtilisateurEndPointService:UtilisateurEndPointService,private _GlobalService:GlobalServiceService,
    private _DateService:DateService, private _OperationEndPointService:OperationEndPointService,
    private _OperationTypeEndPointService:OperationTypeEndPointService) { }
  cols:any[]
  utilisateurs:Utilisateur[]=[]
  loading:boolean=true
  diplay2:boolean=false
  diplay2blovk:boolean=false
  displaymap:boolean=false;
  loading1:boolean=true;
  operations:Operation[]=[];
  operationtypes:OperationType[]=[];
  ngOnInit() {
    this.cols = [
      { field: 'Nom & Prenom', header: 'nom & prenom' },
      { field: 'Identifiant', header: 'identifiant' },
      { field: 'Matricule', header: 'Matricule' },
      { field: 'Login', header: 'Login' },
      { field: 'Login', header: 'Login' },
      { field: 'Status', header: 'Status' },
      { field: 'Action', header: 'Action' },

      
      
    ];
    this.getoperationtype();
    this._UtilisateurEndPointService.findAllByIdPointVente(localStorage.getItem("pointventeid")).subscribe(res=>{
      this.loading=false
      console.log(res);
      
      if(res.result==1){
        this.utilisateurs=res.objectResponse
      }
    })
  }

  findAllOperationsByIdEmploye(idEmploye){
    this.displaymap=true
      this._OperationEndPointService.findAllByIdEmploye(idEmploye).subscribe(val=>{
        this.operations=val.objectResponse
        this.loading1=false;
      })
  }
  findoperationtype(idoperationtype:string){
    let operationtype=this.operationtypes.find(el=>el.idTypeOperation==idoperationtype)
    return  operationtype!=null?operationtype.designation:''
  }
  getoperationtype(){
    this._OperationTypeEndPointService.findAllOperationType().subscribe(val=>{
      this.operationtypes=val.objectResponse!=null?val.objectResponse:[]
    })
  }
  verifconnecteduser(user:Utilisateur){    
    return (localStorage.getItem("UserId")==user.idUtilisateur)
  }
  edituser(user:Utilisateur){
    this.route.navigateByUrl("/pages/Administration/GestionEmployes/UpldateEmploye/"+user.idUtilisateur)
  }
  currentuser:Utilisateur=new Utilisateur()
  deleteuser(){
    console.log(this.currentuser);
    
    this._UtilisateurEndPointService.DeleteUtilisateur(this.currentuser.idUtilisateur).subscribe(val=>{
      if(val.result==1){
        this._GlobalService.showToast('success',"success","Utilisateur est supprimé avec succès")
        this.utilisateurs=this.utilisateurs.filter(user=>user.idUtilisateur!=this.currentuser.idUtilisateur)
      }else{
        this._GlobalService.showToast('danger',"Erruer",val.errorDescription)

      }
    },erreur=>{
      this._GlobalService.showToast('success',"success",erreur)

    })
  }
  adduser(){
    this.route.navigateByUrl("/pages/Administration/GestionEmployes/NouveauEmploye")

  }
  blockuser(user){
    this.currentuser=user;
    if(user.isvalidated==1){
      this.diplay2blovk=true
    }else{
      this.currentuser.isvalidated=1
    this._UtilisateurEndPointService.UpdateUtilisateur(this.currentuser).subscribe(val=>{
      if(val.result==1){
        this._GlobalService.showToast('success',"success","Utilisateur est valdier avec succès")
        this.diplay2blovk=false
        // this.utilisateurs=this.utilisateurs.filter(user=>user.idUtilisateur!=this.currentuser.idUtilisateur)
      }else{
        this._GlobalService.showToast('danger',"Erruer",val.errorDescription)

      }
    },erreur=>{
      this._GlobalService.showToast('success',"success",erreur)

    })
    }
    
  }
  calculeage(date:Date){
    if(date!=null){
      let birthday:Date=new Date(date)
      var timeDiff = Math.abs(Date.now() - this._DateService.deletezonehour(birthday).getTime());
      return Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25) +" ans";
    }else{
      return"-------"
    }
    
   }
  block(){
    this.currentuser.isvalidated=0
    this._UtilisateurEndPointService.UpdateUtilisateur(this.currentuser).subscribe(val=>{
      if(val.result==1){
        this._GlobalService.showToast('success',"success","Utilisateur est Bloquer avec succès")
        this.diplay2blovk=false
        // this.utilisateurs=this.utilisateurs.filter(user=>user.idUtilisateur!=this.currentuser.idUtilisateur)
      }else{
        this._GlobalService.showToast('danger',"Erruer",val.errorDescription)

      }
    },erreur=>{
      this._GlobalService.showToast('success',"success",erreur)

    })
  }

  getnbrh(){
    return this.utilisateurs.filter(val=>val.sexe=="H" || val.sexe==null).length
  }
  getnbrf(){
    return this.utilisateurs.filter(val=>val.sexe=="F").length
  }
}
