import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {environment} from "../../../environments/environment";
import { OneUtilisateurResponse } from '../../model/response/OneUtilisateurResponse';
import { Login } from '../../model/dto/Login';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  host: string = 'http://149.202.3.58:8082/easylink-api-admin/v1/';
  local: string = 'http://localhost:8080/v1/';

  constructor(private httpclient: HttpClient) { }

  header = new HttpHeaders(
    {'Access-Control-Allow-Origin' : '*',
      'Content-type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT'}
  );
  Authentification(login: Login) {
return this.httpclient.post<OneUtilisateurResponse>(environment.backend_url_Admin+'Authentification', login, { headers: this.header });
}

}
