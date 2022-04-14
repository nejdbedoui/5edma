import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '../../../../node_modules/@angular/forms';
import { Router } from '../../../../node_modules/@angular/router';
import {NbComponentStatus} from "@nebular/theme";
import { Utilisateur } from '../../model/Utilisateur';
@Component({
  selector: 'ngx-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.scss']
})
export class ForgotpasswordComponent implements OnInit {

  resetPasswordform:FormGroup;
  user:Utilisateur = new Utilisateur();
  isSubmitted:boolean = false;
  public barLabel: string = "Fiabilité du mot de passe:";
  public myColors = ['#DD2C00', '#FF6D00', '#FFD600', '#AEEA00', '#00C853'];
  public baseColor = '#FFF';
  public strength = 0;
  isShow:boolean = false;
  isChecked:boolean = false;
  userId:string = '';
  isPassword:boolean = false;
  notifStatus: NbComponentStatus = 'danger';

  constructor(private _formBuilder: FormBuilder,private router: Router) { }

  ngOnInit() {
    this.userId = localStorage.getItem('UserId');
    this.resetPasswordform  = this._formBuilder.group({
        password:['',Validators.required],
        confirmPassword:['',Validators.required]
      }
    );
  }
  strengthChanged(strength: number) {
    this.strength = strength;
  }
  get formControls() { return this.resetPasswordform.controls; }



  onUpdate(){
    this.isSubmitted = true;
    if (this.resetPasswordform.invalid){
      console.log("error");
    }else{      
  }
}

  onShowPS(){
    console.log('true');
    this.isShow = true;
  }

}

