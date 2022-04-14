import { Component, OnInit, OnDestroy } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LoginService} from "../../service/login/login.service";
import {Router} from "@angular/router";
import {NbDialogService} from "@nebular/theme";
import { Utilisateur } from '../../model/Utilisateur';
import {
  NbComponentStatus,

  NbToastrService,
} from '@nebular/theme';
import { Login } from '../../model/dto/Login';
import { PointVenteEndPointService } from '../../service/bp-api-pos/point-vente-end-point/point-vente-end-point.service';

@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  displayDialog: boolean;
  index = 1;
  status: NbComponentStatus = 'danger';
  types: NbComponentStatus[] = [
    'primary',
    'success',
    'info',
    'warning',
    'danger',
  ];
  title = 'Erreur!';
  // content = `Veuillez vérifiez vos informations SVP!`;
  loginform:FormGroup;
  login:Login = new Login();
  user:Utilisateur = new Utilisateur();
  isSubmitted:Boolean = false;
  loginError:boolean = false;
  isExist:Boolean=true;
  lang:string;

  constructor(private _formBuilder: FormBuilder,private _loginService:LoginService,private router: Router,private dialogService: NbDialogService,
    private toastrService: NbToastrService,private _PointVenteEndPointService:PointVenteEndPointService) {
  }

  ngOnInit() {

    this.loginform = this._formBuilder.group({
      email:['',[Validators.required]],
      password:['',[Validators.required]],
    });
  }

  get formControls() { return this.loginform.controls; }

  doLogin(){
    localStorage.clear()
    sessionStorage.clear()
    // let lang=localStorage.getItem("lang")
    // localStorage.clear()
    this.isSubmitted = true;
    if (this.loginform.invalid){
      this.makeToast("Veuillez renseigner le login et le mot de passe");
    }else{
      this.login.login = this.loginform.value.email;
      this.login.password = this.loginform.value.password;
      this.login.typeconnection="2"
      this._loginService.Authentification(this.login).subscribe(res=>{
        if(res.result==1){
          localStorage.setItem("UserId",res.objectResponse.idUtilisateur)
          if(res.objectResponse.idPartenaire!=null){
            localStorage.setItem("partenaireid",res.objectResponse.idPartenaire)
            if(res.objectResponse.isvalidated==1){
              this._PointVenteEndPointService.findAllByIdPartenaireBprice(res.objectResponse.idPartenaire).subscribe(val=>{
                if(val.result==1){
                  // if(val.objectResponse.length==1){
                  //   this.router.navigateByUrl("/pages/dashboard");
                  //   localStorage.setItem("pointventeid",val.objectResponse[0].idPointVente)
                  // }else{
                    this.router.navigateByUrl("/auth/choosepointvente");
                  // }
                }
              })
            }else{
              return this.router.navigateByUrl("/auth/resetPassword");
            }
          }else{
            if(res.objectResponse.isvalidated==1){
                    this.router.navigateByUrl("/pages/dashboard");
            }else{
              return this.router.navigateByUrl("/auth/resetPassword");
            }
          }
          
          
        }else{
          this.makeToast(res.errorDescription);
        }
      },error=>{
        this.makeToast("Un problème inattendu est survenu. Veuillez réessayer ultérieurement");
      })
      console.log(this.login.password);
      
    }



  }

  onFirstLogin(){
    return this.router.navigateByUrl("/auth/resetPassword")
  }

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

  makeToast(message) {
    this.showToast(this.status,"Erreur",message);
  }

  Motpasseoublie(){
    return this.router.navigateByUrl("/auth/mailPassword");
  }

}
