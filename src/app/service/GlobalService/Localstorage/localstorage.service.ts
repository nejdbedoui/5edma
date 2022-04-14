import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/share'
@Injectable({
  providedIn: 'root'
})
export class LocalstorageService implements OnDestroy {
  private onSubject = new Subject<{ key: string, value: any }>();
  public changes = this.onSubject.asObservable().share();

  constructor() {  //this.start();
  }
  ngOnDestroy() {
    this.stop();
  }

  public getStorage() {
    let s = [];
    for (let i = 0; i < localStorage.length; i++) {
      s.push({
        key: localStorage.key(i),
        value: JSON.parse(localStorage.getItem(localStorage.key(i)))
      });
    }
    return s;
  }

  public store(key: string, data: any): void {
    localStorage.setItem(key, JSON.stringify(data));
    //the local application doesn't seem to catch changes to localStorage...
    this.onSubject.next({ key: key, value: data})
  }

  public clear(key) {
    localStorage.removeItem(key);
    //the local application doesn't seem to catch changes to localStorage...
    this.onSubject.next({ key: key, value: null });
  }


  public start(): void {
    window.addEventListener("storage", this.storageEventListener.bind(this));
  }

  public storageEventListener(event: StorageEvent) {
    console.log('----ok')
    window.location.reload()
    if (event.storageArea == localStorage) {

      let v;
      try { v = JSON.parse(event.newValue); }
      catch (e) { v = event.newValue; }
      this.onSubject.next({ key: event.key, value: v });
    }
  }

  public stop(): void {
    window.removeEventListener("storage", this.storageEventListener.bind(this));
    this.onSubject.complete();
  }


  private lang=new BehaviorSubject<string>(localStorage.getItem("lang")==null ? 'fr':localStorage.getItem("lang"));
  currentlang= this.lang.asObservable();
  changelang(valeur:string){
    this.lang.next(valeur)
  }

  private sidebarvar=new BehaviorSubject<Boolean>(false);
  currentsidebarvar= this.sidebarvar.asObservable();
  changesidebarvar(valeur:Boolean){
    this.sidebarvar.next(valeur)
  }
  private getfonc=new BehaviorSubject<string>('');
  currentfonc= this.getfonc.asObservable();
  changefonc(valeur:string){
    this.getfonc.next(valeur)
  }

  // private getlistfonc=new BehaviorSubject<AdmFonc[]>([]);
  // currentlistfonc= this.getlistfonc.asObservable();
  // changelistfonc(valeur:AdmFonc[]){
  //   this.getlistfonc.next(valeur)
  // }


  private getaccess=new BehaviorSubject<boolean>(false);
  currentaccess= this.getaccess.asObservable();
  changeaccess(valeur:boolean){
    this.getaccess.next(valeur)
  } 

  private sidebarrole=new BehaviorSubject<string>(null);
  currentsidebarrole= this.sidebarrole.asObservable();
  changesidebarroler(valeur:string){
    this.sidebarrole.next(valeur)
  }


}
