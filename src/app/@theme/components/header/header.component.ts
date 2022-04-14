import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';

import { UserData } from '../../../@core/data/users';
import { LayoutService } from '../../../@core/utils';
import { map, takeUntil, filter } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { UtilisateurEndPointService } from '../../../service/bp-api-admin/utilisateur-end-point/utilisateur-end-point.service';
import { Utilisateur } from '../../../model/Utilisateur';
import { Router } from '@angular/router';
import { PointVenteEndPointService } from '../../../service/bp-api-pos/point-vente-end-point/point-vente-end-point.service';
import { PointVente } from '../../../model/PointVente';
import { LocalstorageService } from '../../../service/GlobalService/Localstorage/localstorage.service';
import { PartenaireBpriceEndPointService } from '../../../service/bp-api-pos/partenaire-bprice-end-point/partenaire-bprice-end-point.service';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;
  user: any;

  themes = [
    {
      value: 'default',
      name: 'Light',
    },
    {
      value: 'dark',
      name: 'Dark',
    },
    {
      value: 'cosmic',
      name: 'Cosmic',
    },
    {
      value: 'corporate',
      name: 'Corporate',
    },
  ];

  currentTheme = 'default';

  userMenu = [ { title: "Profil"}, { title: "Se Déconnecter"} ];

  constructor(private sidebarService: NbSidebarService,
              private menuService: NbMenuService,
              private themeService: NbThemeService,
              private userService: UserData,
              private layoutService: LayoutService,
              private breakpointService: NbMediaBreakpointsService,
              private _UtilisateurEndPointService:UtilisateurEndPointService,
              private router: Router,
              private _PointVenteEndPointService:PointVenteEndPointService,
              private _LocalstorageService:LocalstorageService,
              private _PartenaireBpriceEndPointService:PartenaireBpriceEndPointService) {
  }

  utilisateur:Utilisateur=new Utilisateur()
  username:string=""
  pointventes:PointVente[]=[]
  pointvente:PointVente=new PointVente();
  currentpv;
  options : any[];
  afficheselect:boolean=false
  selectedOption;
  partenaireexist:boolean=true
  logo:string=null
  ngOnInit() {
    if(localStorage.getItem("partenaireid")==null){
      this.partenaireexist=false
    }else{
      this._PointVenteEndPointService.findPointVenteByIdPointVente(localStorage.getItem("pointventeid")).subscribe(val=>{
        this.pointvente=val.objectResponse
      })
      this.partenaireexist=true
      this._PartenaireBpriceEndPointService.findByIdPartenaire(localStorage.getItem("partenaireid")).subscribe(val=>{
        this.logo=val.objectResponse!=null?val.objectResponse.logo!=null?val.objectResponse.logo:null:null
        
      })
    }
    
    this._UtilisateurEndPointService.findUtilisateurByIdUtilisateur(localStorage.getItem("UserId")).subscribe(val=>{      
      if(val.result==1){
        this.utilisateur=val.objectResponse
        this.username=val.objectResponse.nom +" "+ val.objectResponse.prenom
      }
    })
    if(localStorage.getItem("partenaireid")!=null){
      this.afficheselect=true
      this._PointVenteEndPointService.findAllByIdPartenaireBprice(localStorage.getItem("partenaireid")).subscribe(val=>{        
        if(val.result==1){
          
          this.pointventes=val.objectResponse
          let allpv:PointVente=new PointVente()
          allpv.idPointVente="1"
          allpv.designation="Parametres (produit - categories)"
          this.pointventes.push(allpv)
          let dash:PointVente=new PointVente()
          dash.idPointVente="0"
          dash.designation="Tableau de bord générale"
          this.pointventes.push(dash)
          if(localStorage.getItem("pointventeid")!=null){
            setTimeout(()=>{
              this.currentpv=localStorage.getItem("pointventeid")
            },0)
          }else{
            setTimeout(()=>{
              this.currentpv=localStorage.getItem("type") 
            },0)
          }
        }
      })
    }

    
    this.currentTheme = this.themeService.currentTheme;

    this.userService.getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((users: any) => this.user = users.nick);

    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$),
      )
      .subscribe((isLessThanXl: boolean) => this.userPictureOnly = isLessThanXl);

    this.themeService.onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$),
      )
      .subscribe(themeName => this.currentTheme = themeName);

      this.menuService.onItemClick()
      .pipe(
        filter(({ tag }) => tag === 'my-context-menu'),
        map(({ item: { title } }) => title),
      )
      .subscribe(title => {

        if(title=="Se Déconnecter" || title=="تسجيل الخروج" ){
          localStorage.clear();
          sessionStorage.clear();
          this.router.navigateByUrl('/auth/login');
        }else if(title=="Se Déconnecter de la Session" || title=="تسجيل الخروج من هذا الحساب"){
          sessionStorage.clear();
          window.close()
        }else {
          this.router.navigateByUrl('/pages/Administration/GestionUserProfil');

        }

      });
  }
  changepv(event){

    if(event!='0' && event!='1'){
      localStorage.removeItem("type")
      localStorage.setItem("pointventeid",event)
      this._LocalstorageService.changesidebarroler(event)
      this.router.navigateByUrl('/pages/dashboard');
    }else{
      localStorage.removeItem("pointventeid")
      localStorage.setItem("type",event)
      this._LocalstorageService.changesidebarroler(event)
      this.router.navigateByUrl('/pages/dashboard');
    }
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName);
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize();

    return false;
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }
  navigateaccueil(){
    localStorage.removeItem("type")
    localStorage.removeItem("pointventeid")
    this.router.navigateByUrl('/auth/choosepointvente');

  }
}
