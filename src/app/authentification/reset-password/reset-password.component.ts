import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import { Utilisateur } from '../../model/Utilisateur';
import { ResetPasswordDto } from '../../model/dto/ResetPasswordDto';
import { UtilisateurEndPointService } from '../../service/bp-api-admin/utilisateur-end-point/utilisateur-end-point.service';
import { NbComponentStatus, NbToastrService } from '@nebular/theme';
import { PointVenteEndPointService } from '../../service/bp-api-pos/point-vente-end-point/point-vente-end-point.service';

@Component({
  selector: 'ngx-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  resetPasswordform:FormGroup;
  user:Utilisateur = new Utilisateur();
  isSubmitted:boolean = false;
  public barLabel: string = "Fiabilité du mot de passe:";
  public myColors = ['#DD2C00', '#FF6D00', '#FFD600', '#AEEA00', '#00C853'];
  public baseColor = '#FFF';
  public strengthLabels = ['(Inutile)', '(Faible)', '(Normal)', '(Fort)', '(Génial!)'];
  public strength = 0;
  isShow:boolean = false;
  isChecked:boolean = false;
  userId:string = '';
  mdpError:boolean = false;

  constructor(private _formBuilder: FormBuilder,private router: Router,private _UtilisateurEndPointService:UtilisateurEndPointService,
    private toastrService: NbToastrService,private _PointVenteEndPointService:PointVenteEndPointService) { }

  ngOnInit() {
    if (localStorage.getItem('provisionalPwd') == '0'){
      this._PointVenteEndPointService.findAllByIdPartenaireBprice(localStorage.getItem("partenaireid")).subscribe(val=>{
        if(val.result==1){
          // if(val.objectResponse.length==1){
          //   this.router.navigateByUrl("/pages/dashboard");
          //   localStorage.setItem("pointventeid",val.objectResponse[0].idPointVente)
          // }else{
            this.router.navigateByUrl("/auth/choosepointvente");
          // }
        }
      })
    }
    this.userId = localStorage.getItem('UserId');
    this.resetPasswordform  = this._formBuilder.group({
        oldPassword:['', Validators.required],
        password:['',Validators.required],
        confirmPassword:['',Validators.required]
      }
    );
  }
  strengthChanged(strength: number) {
    this.strength = strength;
  }
  get formControls() { return this.resetPasswordform.controls; }
  onConfirm(){
    this.isSubmitted = true;
    if (this.resetPasswordform.invalid ){
      console.log("error");
    }else{
      if(this.resetPasswordform.value.password!=this.resetPasswordform.value.confirmPassword){
        this.mdpError=true
      }else{
        let restpassword:ResetPasswordDto=new ResetPasswordDto()
        restpassword.iduser=localStorage.getItem("UserId")
        restpassword.oldpassword=this.resetPasswordform.value.oldPassword
        restpassword.password=this.resetPasswordform.value.password
        this._UtilisateurEndPointService.Editpaaswor(restpassword).subscribe(val=>{
          console.log(val);
          
          if(val.result==1){
            this.router.navigateByUrl("/auth/choosepointvente");
          }else{
            this.showToast(this.status,"Erreur",val.errorDescription);
          }
        },errur=>{
          this.showToast(this.status,"Erreur","Un problème inattendu est survenu. Veuillez réessayer ultérieurement");
        })
      }

    }
  }
  onShowPS(){
    console.log('true');
    this.isShow = true;
  }
  lang:string
  onreset(){

  }
  status: NbComponentStatus = 'danger';
  types: NbComponentStatus[] = [
    'primary',
    'success',
    'info',
    'warning',
    'danger',
  ];
  private showToast(type:NbComponentStatus, title: string, body: string) {
    const config = {
      status: type,

    };
    const titleContent = title ? `${title}` : '';

    this.toastrService.show(
      body,
      `${titleContent}`,
      config);


  }

}
