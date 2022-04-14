import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { Router } from '../../../../node_modules/@angular/router';
import { Utilisateur } from '../../model/Utilisateur';
import {
  NbComponentStatus,

  NbToastrService,
} from '@nebular/theme';



@Component({
  selector: 'ngx-mailpassword',
  templateUrl: './mailpassword.component.html',
  styleUrls: ['./mailpassword.component.scss']



})
export class MailpasswordComponent implements OnInit {


  sendmailform:FormGroup;
  user:Utilisateur = new Utilisateur();
  isSubmitted:boolean = false;
  isShow:boolean = false;
  isExist:boolean = false;
  isChecked:boolean = false;
  userId:string = '';
  newuser:Utilisateur = new Utilisateur();
  status: NbComponentStatus = 'success';
  statusdang: NbComponentStatus = 'danger';
  types: NbComponentStatus[] = [
    'primary',
    'success',
    'info',
    'warning',
    'danger',
  ];
  title = 'Envoie!';
  content = `Prière de rénitialiser votre mot de passe !`;

  titledang = 'Echoué!';

  constructor(private _formBuilder: FormBuilder,private router:Router,private toastrService: NbToastrService) { }

  ngOnInit() {
    this.userId = localStorage.getItem('UserId');
    this.sendmailform  = this._formBuilder.group({

      email:['',[Validators.required,Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9]+.[a-zA-Z]+.[a-zA-Z]{2,3}$')]]

      },
    );
  }

  get formControls() { return this.sendmailform.controls; }
  onConfirm(){
    this.isSubmitted = true;
    if (this.sendmailform.invalid){
      console.log("error");

    }else{


  }
}


}





