import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilisateurTypeEndPointService } from '../../../../service/bp-api-admin/utilisateur-type-end-point/utilisateur-type-end-point.service';
import { ProfilEndPointService } from '../../../../service/bp-api-admin/profil-end-point/profil-end-point.service';
import { UtilisateurEndPointService } from '../../../../service/bp-api-admin/utilisateur-end-point/utilisateur-end-point.service';
import { GlobalServiceService } from '../../../../service/GlobalService/global-service.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TypeUtilisateur } from '../../../../model/TypeUtilisateur';
import { Profil } from '../../../../model/Profil';
import { Utilisateur } from '../../../../model/Utilisateur';

@Component({
  selector: 'ngx-upade-employes',
  templateUrl: './upade-employes.component.html',
  styleUrls: ['./upade-employes.component.scss']
})
export class UpadeEmployesComponent implements OnInit {

  constructor(private _FormBuilder:FormBuilder,private _UtilisateurTypeEndPointService:UtilisateurTypeEndPointService,
    private _ProfilEndPointService:ProfilEndPointService,private _UtilisateurEndPointService:UtilisateurEndPointService,
    private _GlobalService:GlobalServiceService, private router:Router,private route :ActivatedRoute) { }
  loading:boolean=false
  userForm:FormGroup;
  isuserFormSubmitted:boolean=false
  typeutlisateurs:TypeUtilisateur[]=[]
  profils:Profil[]=[]
  id:string = this.route.snapshot.paramMap.get('id');
utilisateur:Utilisateur=new Utilisateur()
user:Utilisateur;
sexe = [
  { label: 'Homme', value: 'H' },
  { label: 'Femme', value: 'F' }
];
  ngOnInit() {
    this.userForm=this._FormBuilder.group({
      nom:['',[Validators.required]],
      prenom:['',[Validators.required]],
      login:['',[Validators.required]],
      matricule:[''],
      identifiant:['',[Validators.required]],
      idTypeUtilisateur:['',[Validators.required]],
      idProfil:[''],
      email:[''],
      password:['',[Validators.required]],
      tel:['',[Validators.required]],
      adresse:['',[Validators.required]],
      Cpassword:['',[Validators.required]],
      sexe:[this.sexe[0].value,[Validators.required]]
    })
    this._UtilisateurTypeEndPointService.findAllTypeUtilisateurByFActif(1).subscribe(val=>{
      
      
      this.typeutlisateurs=val.objectResponse
      this.typeutlisateurs=this.typeutlisateurs.filter(vall=>vall.code!="adminbprice" && vall.code!="PROP")

      this._ProfilEndPointService.findAllprofilByFActif(1).subscribe(val=>{
        this.profils=val.objectResponse
          this._UtilisateurEndPointService.findUtilisateurByIdUtilisateur(this.id).subscribe(val=>{
            console.log(val);
            this.utilisateur=val.objectResponse
            this.user = val.objectResponse
            this.userForm=this._FormBuilder.group({
              nom:[this.utilisateur.nom,[Validators.required]],
              prenom:[this.utilisateur.prenom,[Validators.required]],
              login:[this.utilisateur.login,[Validators.required]],
              matricule:[this.utilisateur.matricule],
              identifiant:[this.utilisateur.identifiant,[Validators.required]],
              idTypeUtilisateur:[this.typeutlisateurs.filter(vall=>vall.idTypeUtilisateur==this.utilisateur.idTypeUtilisateur)[0],[Validators.required]],
              idProfil:[this.utilisateur.idProfil!=null?this.profils.filter(vall=>vall.idProfil==this.utilisateur.idProfil)[0]:null],
              email:[this.utilisateur.email],
              password:[this.utilisateur.password,[Validators.required]],
              tel:[this.utilisateur.tel,[Validators.required]],
              adresse:[this.utilisateur.adresse,[Validators.required]],
              Cpassword:[this.utilisateur.password,[Validators.required]],
              sexe:[this.utilisateur.sexe!=null?this.sexe.filter(el=>el.value==this.utilisateur.sexe)[0].value:'',[Validators.required]]
            })
          })
      })
    })
    
  }

  get formControlsuser() { return this.userForm.controls; }
  isemailvalid:boolean=false
  confirmpass:boolean=false

  adduser(){
    this.isuserFormSubmitted=true
    if(this.userForm.value.idTypeUtilisateur.code=='collaborateur' ){
      this.userForm.controls['login'].setValue('logincollaborateur');
      this.userForm.controls['password'].setValue('passwordcollaborateur');
      this.userForm.controls['Cpassword'].setValue('passwordcollaborateur');
    }
    var EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    if(this.userForm.value.email!=null && this.userForm.value.email!=''){
      if( !EMAIL_REGEXP.test(this.userForm.value.email)){
        this.isemailvalid=true
      }else{
        this.isemailvalid=false
      }
    }else{
      this.isemailvalid=false
    }
    if(this.userForm.value.Cpassword!=null && this.userForm.value.Cpassword!=this.userForm.value.password){
      this.confirmpass=true
    }else{
      this.confirmpass=false
    }
    if(this.userForm.invalid || this.isemailvalid  || this.confirmpass){
      return
    }else{
      console.log(this.userForm.value);
      this.loading=true
      let user:Utilisateur=new Utilisateur()
      user.nom=this.userForm.value.nom
      user.prenom=this.userForm.value.prenom
      if(this.userForm.value.idTypeUtilisateur.code!='collaborateur' ){
        user.login=this.userForm.value.login
        user.password=this.userForm.value.password
      }else{
        user.login=null
        user.password=null
      }
      
      user.identifiant=this.userForm.value.identifiant
      user.email=this.userForm.value.email
      user.matricule=this.userForm.value.matricule
      user.idTypeUtilisateur=this.userForm.value.idTypeUtilisateur.idTypeUtilisateur
      // user.idProfil=this.userForm.value.idProfil.idProfil
      user.idPointVente=localStorage.getItem("pointventeid")
      user.idPartenaire=localStorage.getItem("partenaireid")
      user.fActif=this.utilisateur.fActif
      user.isvalidated=this.utilisateur.isvalidated
      user.idUtilisateur=this.id
      user.sexe=this.userForm.value.sexe
      user.tel=this.userForm.value.tel
      user.adresse=this.userForm.value.adresse
      this._UtilisateurEndPointService.UpdateUtilisateur(user).subscribe(res=>{
        console.log(res);
        
        if(res.result==1){
          this.loading=false
          this.router.navigateByUrl("/pages/Administration/GestionEmployes")
          
        }else{
          this.loading=false
          this._GlobalService.showToast("danger","Erreur",res.errorDescription);
        }
        
      },erreur=>{
        this.loading=false
        this._GlobalService.showToast("danger","Erreur",erreur);
      })

    }
  }

  possible:string = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890[]=-)(*&^%$#@!";

  generatepassword(lengthOfCode: number, possible: string):string {
    let text = "";
    for (let i = 0; i < lengthOfCode; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }
  affectrandompassword(){
    this.userForm.controls['password'].setValue(this.generatepassword(8,this.possible));
  }

  returntolist(){
    this.router.navigateByUrl("/pages/Administration/GestionEmployes")
  }

}
