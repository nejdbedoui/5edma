import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import * as uuid from 'uuid';
@Injectable({
  providedIn: 'root'
})
export class FileEndPointService {

  header = new HttpHeaders(
    {'Access-Control-Allow-Origin' : '*',
      'Content-type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT'}
  );
  constructor(private httpclient:HttpClient) { }

  
  uplodeimage(file:File,uuid:string){
    let myNewFile = new File([file], uuid+file.name, {type: file.type});
    let formdata: FormData = new FormData(); 
      formdata.append('file', myNewFile);
      return this.httpclient.post<any>(environment.backend_url_Admin+"upload",formdata)
  }
}
