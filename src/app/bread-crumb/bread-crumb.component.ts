import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {LocalstorageService} from "../service/GlobalService/Localstorage/localstorage.service";

@Component({
  selector: 'ngx-bread-crumb',
  templateUrl: './bread-crumb.component.html',
  styleUrls: ['./bread-crumb.component.scss']
})
export class BreadCrumbComponent implements OnInit {

  currenturl:string;
  previousurl:string;
  current:string;
  previous:string;
  parent:string;
  homeurl:string = '/pages/dashboard';
  links:string[]=[];
  isParentHome:boolean = false;
  lang:string = localStorage.getItem("lang");
  constructor(private router:Router,private _localstorage:LocalstorageService) {

  }

  ngOnInit() {
    //console.log('current :  ' + this.router.url);
    this.currenturl = this.router.url ;
    this.links = this.currenturl.replace('/pages/', '').split(/(?=[/])/);
    // if (this.current.includes('/')){
    //   this.current=this.current.substr(0,this.current.indexOf('/'));
    // }
    //console.log(this.links);
    if (this.links.length == 2){
      this.isParentHome = true;
      this.previous = this.links[0];
      this.previousurl = this.currenturl;
      this.current = this.links[1].replace('/','').split(/(?=[A-Z])/).join(" ");
      //console.log(this.current);
      //console.log(this.previous);
    }else if (this.links.length > 2){
      this.parent = this.links[0];
      this.previousurl = '/pages/'+this.links[0]+this.links[1];
      this.previous = this.links[1].replace('/','').split(/(?=[A-Z])/).join(" ");
      this.current = this.links[2].replace('/','').split(/(?=[A-Z])/).join(" ");
    }
    this._localstorage.currentlang.subscribe(res=>{
      this.lang=res
      this.lang= res;
      localStorage.setItem("lang",res);
    })
  }

}
