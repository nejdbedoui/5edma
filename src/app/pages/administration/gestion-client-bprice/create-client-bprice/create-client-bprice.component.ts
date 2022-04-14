import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { environment } from '../../../../../environments/environment';
import { Devise } from '../../../../model/Devise';
import { Caisse } from '../../../../model/Caisse';
import { TypeCaisse } from '../../../../model/TypeCaisse';
import * as uuid from 'uuid';
import { Fichepointvente } from '../../../../model/dto/Fichepointvente';
import { NbComponentStatus, NbToastrService } from '@nebular/theme';
import { CaisseperFiche } from '../../../../model/dto/CaisseperFiche';
import { CaisseTypeEndPointService } from '../../../../service/bp-api-pos/caisse-type-end-point/caisse-type-end-point.service';
import { TaxeEndPointService } from '../../../../service/bp-api-pos/taxe-end-point/taxe-end-point.service';
import { ModeReglementEndPointService } from '../../../../service/bp-api-pos/mode-reglement-end-point/mode-reglement-end-point.service';
import { Taxe } from '../../../../model/Taxe';
import { ModeReglement } from '../../../../model/ModeReglement';
import { TypeUtilisateur } from '../../../../model/TypeUtilisateur';
import { Profil } from '../../../../model/Profil';
import { ProfilEndPointService } from '../../../../service/bp-api-admin/profil-end-point/profil-end-point.service';
import { UtilisateurEndPointService } from '../../../../service/bp-api-admin/utilisateur-end-point/utilisateur-end-point.service';
import { UtilisateurTypeEndPointService } from '../../../../service/bp-api-admin/utilisateur-type-end-point/utilisateur-type-end-point.service';
import { Utilisateur } from '../../../../model/Utilisateur';
import * as L from 'leaflet';
import { PartenaireBprice } from '../../../../model/PartenaireBprice';
import { PartenaireBpriceEndPointService } from '../../../../service/bp-api-pos/partenaire-bprice-end-point/partenaire-bprice-end-point.service';
import { DeviseEndPointService } from '../../../../service/bp-api-pos/devise-end-point/devise-end-point.service';
import { CaisseEndPointService } from '../../../../service/bp-api-pos/caisse-end-point/caisse-end-point.service';
import { PointVenteEndPointService } from '../../../../service/bp-api-pos/point-vente-end-point/point-vente-end-point.service';
import { PointVente } from '../../../../model/PointVente';
import { SectorEndPointService } from '../../../../service/bp-api-pos/sector-end-point/sector-end-point.service';
import { Sector } from '../../../../model/Sector';
import { Router } from '@angular/router';
import { BilletMonnaie } from '../../../../model/BilletMonnaie';
import { FileEndPointService } from '../../../../service/bp-api-admin/file-end-point/file-end-point.service';
import { Prodcut } from '../../../../model/Product';
import { ProductCategorieArticleidDto } from '../../../../model/dto/ProductCategorieArticleidDto';
import { Productsdto } from '../../../../model/dto/Productsdto';
import { PointVentespriceDto } from '../../../../model/dto/PointVentespriceDto';
import { ProductEndPointService } from '../../../../service/bp-api-product/product-end-point/product-end-point.service';

@Component({
  selector: 'ngx-create-client-bprice',
  templateUrl: './create-client-bprice.component.html',
  styleUrls: ['./create-client-bprice.component.scss']
})
export class CreateClientBpriceComponent implements OnInit {

  constructor(private _FormBuilder: FormBuilder,private toastrService: NbToastrService,private _CaisseTypeEndPointService:CaisseTypeEndPointService
    ,private _TaxeEndPoinrService:TaxeEndPointService,private _ModeReglementEndPointService:ModeReglementEndPointService,
    private _ProfilEndPointService:ProfilEndPointService, private _UtilisateurTypeEndPointService:UtilisateurTypeEndPointService,
    private _PartenaireBpriceEndPointService:PartenaireBpriceEndPointService,private _DeviseEndPointService:DeviseEndPointService,
    private _UtilisateurEndPointService:UtilisateurEndPointService,private _CaisseEndPointService:CaisseEndPointService,
    private _PointVenteEndPointService:PointVenteEndPointService, private _SectorEndPointService:SectorEndPointService,
    private router: Router,private _FileEndPointService:FileEndPointService,
    private _ProductEndPointService:ProductEndPointService) { }

  isfirststepFormSubmitted:boolean=false
  isficheFormSubmitted:boolean=false
  isdeviseFormSubmitted:boolean=false
  isuserFormSubmitted:boolean=false
  istaxeFormSubmitted:boolean=false
  displaytaxe:boolean=false
  displaymap:boolean=false
  firststepForm: FormGroup;
  deviseForm: FormGroup;
  caisseForm:FormGroup;
  loading:boolean=false
  file:string=""
  file2:string=""
  image: any;
  files:File;
  files2:File;
  imagename:string;
  displayfiche:boolean=false
  fiche:boolean=true
  dtOptions
  ficheForm:FormGroup;
  userForm:FormGroup;
  taxeForm:FormGroup;
  typeutlisateurs:TypeUtilisateur[]=[]
  profils:Profil[]=[]
  product:Prodcut = new Prodcut();
  uuids=uuid.v4();
  public placeholder: string = "designation"  ;
  public keyword = 'designation';
  options = [
    { value: '0', label: 'Prix hors taxe' , checked: true},
    { value: '1', label: 'Prix taxe-inclue' }
  ];
  typePvs = [
    { value: 'pointVente', label: 'point Vente' , checked: true},
    { value: 'centraleStock', label: 'centrale Stock' },
    { value: 'vehicule', label: 'vehicule' }
  ];
  sexe = [
    { label: 'Homme', value: 'H' },
    { label: 'Femme', value: 'F' }
  ];
  options2 = {
    layers: [
      L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' }),
    ],
    zoom: 5,
    center: L.latLng({ lat: 36.804971, lng: 10.165990 }),
  };
  listdevise:Devise[]=[]
  ngOnInit() {
    this._DeviseEndPointService.findAllByIdPointVenteIsNull().subscribe(devise=>{
      console.log(devise.objectResponse);
      this.listdevise=devise.objectResponse
    })
    $(".dataTables_empty").text("There are currently no xyz available for this.");

    this.dtOptions = {
      paging: false,
      searching: false
      // "oLanguage": {"sZeroRecords": "La liste est vide", "sEmptyTable": "La liste est vide"}
    };

    this.firststepForm=this._FormBuilder.group({
      rcs:['',[Validators.required]],
      Abbreviation:['',[Validators.required]],
      Matricule:['',[Validators.required]],
      Secteur:['',[Validators.required]],
      Adresse:['',[Validators.required]],
      Tel:['',[Validators.required]],
      Site:[''],
    })
    this.ficheForm=this._FormBuilder.group({
      designation:['',[Validators.required]],
      cordx:['',[Validators.required]],
      cordy:['',[Validators.required]],
      adresse:[],
      gestiontable:[false,[Validators.required]],
      autoriserphoto:[false,[Validators.required]],
      clavier:[false,[Validators.required]],
      Imprimante:[false,[Validators.required]],
      autoriserpartage:[false,[Validators.required]],
      reimprimer:[false,[Validators.required]],
      autoriserimpression:[false,[Validators.required]],
      entetepiedticket:[false,[Validators.required]],
      Controlercaisse:[false],
      taxeselected:[,[Validators.required]],
      taxe:[],
      prixproduitrecu:[this.options[0].value,[Validators.required]],
      paiment:[null,[Validators.required]],
      defaultouverture:[''],
      differenceautorise:[''],
      chiffrevirgule:[''],
      entete:[''],
      pied:[''],
      fdetectPack:[false],
      faffectEmployetoservice:[false],
      FautoriserRecharge:[false],
      fdetailMontant:[false],
      fReservation:[false],
      typePv:["pointVente"],
      fEcranCuisine:[false],
      dateMiseCirc:[new Date()]
    })
    this.deviseForm=this._FormBuilder.group({
      designation:['',[Validators.required]],
      code:['',[Validators.required]],
      taux:['',[Validators.required]],
      fdefault:[false]
    })
    this.caisseForm=this._FormBuilder.group({
      numCaisse:['',[Validators.required]],
      typeCaisse:['',[Validators.required]],
      reference:['',[Validators.required]]      
    })
    
    this.userForm=this._FormBuilder.group({
      nom:['',[Validators.required]],
      prenom:['',[Validators.required]],
      login:['',[Validators.required]],
      matricule:['',[Validators.required]],
      identifiant:['',[Validators.required]],
      idTypeUtilisateur:['',[Validators.required]],
      idProfil:[''],
      email:['',[Validators.required,Validators.email,Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9]+.[a-zA-Z]+.[a-zA-Z]{2,3}$')]],
      password:['',[Validators.required]],
      tel:['',[Validators.required]],
      adresse:['',[Validators.required]],
      sexe:[this.sexe[0].value,[Validators.required]]
    })
    this.taxeForm=this._FormBuilder.group({
      porteeTaxe:['',[Validators.required]],
      typeTaxe:['',[Validators.required]],
      valeur:['',[Validators.required]],
      fDefault:[false]
    })
    this._CaisseTypeEndPointService.findalltypecaisse().subscribe(res=>{
      if(res.result==1){
        this.typecaisses=res.objectResponse
      }
      
    })
    this._TaxeEndPoinrService.findAlltaxeByFActif(1).subscribe(val=>{
      if(val.result==1){
        this.taxes=val.objectResponse
      }
    })
    this._ModeReglementEndPointService.findAllModeReglement().subscribe(val=>{
      if(val.result==1){
        this.modeReglements=val.objectResponse
        this.modeReglements=this.modeReglements.filter(el=>el.idPointVente==null)
      }
    })
    this._ProfilEndPointService.findAllprofilByFActif(1).subscribe(val=>{
      this.profils=val.objectResponse
    })
    this._UtilisateurTypeEndPointService.findAllTypeUtilisateurByFActif(1).subscribe(val=>{
      this.typeutlisateurs=val.objectResponse
    })
    this._SectorEndPointService.findAllSectorByFActif(1).subscribe(val=>{
      this.sectors=val.objectResponse
    })
  }
taxes:Taxe[]=[]
sectors:Sector[]=[]
modeReglements:ModeReglement[]=[]
  onFileChange(ev) {
    console.log(ev.target.files[0]);

    this.files = ev.target.files[0];
    if(this.files.name.toLocaleLowerCase().endsWith(".png")||this.files.name.toLocaleLowerCase().endsWith(".jpg")||this.files.name.toLocaleLowerCase().endsWith(".gif")||this.files.name.toLocaleLowerCase().endsWith(".jpeg")){
      let name:String="";
      name=this.files.name;
      console.log(name);

      name=name.replace(" ","_");
      name.split(" ").forEach(vam=>{
        name=name.replace(' ',"_");
      })
      this.imagename=environment.image_url+"/" + this.uuids+name
      const reader = new FileReader();
      reader.onload = () => {
        this.image = reader.result;
      }
      reader.readAsDataURL(this.files);
    }else{

    }

  }
  color1:any
  color2:any
  imagename2:string
  image2:any
  onFileChange2(ev) {
    console.log(ev.target.files[0]);

    this.files2 = ev.target.files[0];
    if(this.files2.name.toLocaleLowerCase().endsWith(".png")||this.files2.name.toLocaleLowerCase().endsWith(".jpg")||this.files2.name.toLocaleLowerCase().endsWith(".gif")||this.files2.name.toLocaleLowerCase().endsWith(".jpeg")){
      let name:String="";
      name=this.files2.name;
      console.log(name);

      name=name.replace(" ","_");
      name.split(" ").forEach(vam=>{
        name=name.replace(' ',"_");
      })
      this.imagename2=environment.image_url+"/" +this.uuids+ name
      const reader = new FileReader();
      reader.onload = () => {
        this.image2 = reader.result;
      }
      reader.readAsDataURL(this.files2);
    }else{

    }

  }
  onEventLog(evnt,evnt2){
    this.color1=evnt2.color
  }
  onEventLog2(evnt,evnt2){
    this.color2=evnt2.color
  }
  partenaire:PartenaireBprice=new PartenaireBprice()
  createPartenaire(stepper){
    this.isfirststepFormSubmitted=true;
    console.log(this.firststepForm);
    //stepper.next()
    if(this.firststepForm.invalid){
      return
    }else{
      console.log(this.firststepForm.value)
      this.partenaire.idChart="1"
      this.partenaire.dateCreation=new Date()
      this.partenaire.fActif=1
      this.partenaire.idVille="1"
      this.partenaire.matriculeFiscale=this.firststepForm.value.Matricule
      this.partenaire.nTel=this.firststepForm.value.Tel
      this.partenaire.raisonSociale=this.firststepForm.value.rcs
      this.partenaire.siteWeb=this.firststepForm.value.Site
      this.partenaire.adresse=this.firststepForm.value.Adresse
      this.partenaire.logo=this.imagename
      this.partenaire.abbreviation=this.firststepForm.value.Abbreviation
      this.partenaire.imagePanormaic=this.imagename2
      this.partenaire.idSector=this.firststepForm.value.Secteur.idSector
      this.partenaire.couleur1=this.color1
      this.partenaire.couleur2=this.color2
      stepper.next()
    }
  }

  get formControls() { return this.firststepForm.controls; }
  get formControlsfiche() { return this.ficheForm.controls; }
  get formControlsdevise() { return this.deviseForm.controls; }
  get formControlscaisse() { return this.caisseForm.controls; }
  get formControlsuser() { return this.userForm.controls; }
  get formControlstaxe() { return this.taxeForm.controls; }

  
  addPointVente(){

  }
  pointVentefiches:any[]=[]
  
  addfichepointvente(){
    this.isficheFormSubmitted=true

    if(this.ficheForm.invalid){
      this.showToast(this.status,"Erreur", "Veuillez remplir les champs obligatoires");

      return
    }else{
      let pointVentefiche:Fichepointvente=new Fichepointvente()    
      console.log(this.ficheForm.value);
        
      pointVentefiche=this.ficheForm.value
      pointVentefiche.fdetectPack=this.ficheForm.value.fdetectPack
      pointVentefiche.adresse=this.ficheForm.value.adresse
      pointVentefiche.devise=this.devises
      pointVentefiche.taxe=this.taxes
      pointVentefiche.fAffectEmployetoservice=this.ficheForm.value.faffectEmployetoservice
      pointVentefiche.fAutoriserRecharge=this.ficheForm.value.FautoriserRecharge
      pointVentefiche.fdetailMontant=this.ficheForm.value.fdetailMontant
      pointVentefiche.fReservation=this.ficheForm.value.fReservation
      pointVentefiche.fEcranCuisine=this.ficheForm.value.fEcranCuisine
      pointVentefiche.typePv=this.ficheForm.value.typePv
      pointVentefiche.dateMiseCirc=this.ficheForm.value.typePv=="vehicule"?this.ficheForm.value.dateMiseCirc:null
      if(this.currentpointventefiche.idFichepointvente!=null){
        this.pointVentefiches=this.pointVentefiches.filter(val=>val.idFichepointvente!=this.currentpointventefiche.idFichepointvente)
        pointVentefiche.idFichepointvente=this.currentpointventefiche.idFichepointvente

      }else{
        pointVentefiche.idFichepointvente=uuid.v4()

      }   
      
      
      this.pointVentefiches.push(pointVentefiche)
      console.log(this.pointVentefiches);
      console.log(this.ficheForm.value);
      this.fiche=true
      this.resetefichepointvente()
    }
  }
devises:Devise[]=[]
devises2:Devise[]=[]
  adddevise(){
    this.isdeviseFormSubmitted=true
    if(this.deviseForm.invalid){
      return
    }else{
      console.log(this.deviseForm);
      let devise:Devise=new Devise()
      if(this.currentdevise.idDevise!=null){
        this.devises=this.devises.filter(val=>val.idDevise!=this.currentdevise.idDevise)
      }
      devise.designation=this.deviseForm.value.designation
      devise.code=this.deviseForm.value.code
      devise.taux=this.deviseForm.value.taux
      devise.fDefaut=this.deviseForm.value.fdefault
      devise.idDevise=uuid.v4()
      let refmono:BilletMonnaie=new BilletMonnaie()
      let refmono1:BilletMonnaie=new BilletMonnaie()
      let refmono2:BilletMonnaie=new BilletMonnaie()
      let refmonos:BilletMonnaie[]
      refmono.designation="10 TND"
      refmono.fbillet=1
      refmono.valeur=10
      refmono1.designation="20 TND"
      refmono1.fbillet=1
      refmono1.valeur=20
      refmono2.designation="50 TND"
      refmono2.fbillet=1
      refmono2.valeur=50
      devise.refMonetique=[]
      devise.refMonetique.push(refmono)
      devise.refMonetique.push(refmono1)
      devise.refMonetique.push(refmono2)
      this.devises.push(devise)
      this.displayfiche=false
      this.resetdeviceform()
      this.auto.clear();
    }
  }
  @ViewChild('ngAutoCompleteStatic',{static:false}) auto;
  resetdeviceform(){
    this.deviseForm=this._FormBuilder.group({
      designation:['',[Validators.required]],
      code:['',[Validators.required]],
      taux:['',[Validators.required]],
      fdefault:[false]
    })
    this.isdeviseFormSubmitted=false
  }
  resetefichepointvente(){
    this.ficheForm=this._FormBuilder.group({
      designation:['',[Validators.required]],
      cordx:['',[Validators.required]],
      cordy:['',[Validators.required]],
      adresse:[],
      gestiontable:[false,[Validators.required]],
      autoriserphoto:[false,[Validators.required]],
      clavier:[false,[Validators.required]],
      Imprimante:[false,[Validators.required]],
      autoriserpartage:[false,[Validators.required]],
      reimprimer:[false,[Validators.required]],
      autoriserimpression:[false,[Validators.required]],
      entetepiedticket:[false,[Validators.required]],
      Controlercaisse:[false],
      taxe:[],
      taxeselected:[,[Validators.required]],
      prixproduitrecu:[this.options[0].value,[Validators.required]],
      paiment:[null,[Validators.required]],
      defaultouverture:[''],
      differenceautorise:[''],
      chiffrevirgule:[''],
      entete:[''],
      pied:[''],
      fdetectPack:[false],
      faffectEmployetoservice:[false],
      FautoriserRecharge:[false],
      fdetailMontant:[false],
      fReservation:[false],
      fEcranCuisine:[false],
      typePv:["pointVente"],
      dateMiseCirc:[new Date()]
    })
    this.isficheFormSubmitted=false
    this.devises=[]
    this.taxes=[]
    this.currentpointventefiche=new Fichepointvente()
  }
  displayuser:boolean=false
currentdevise:Devise=new Devise()
  editdevise(item:Devise){
    this.currentdevise=item
    this.deviseForm=this._FormBuilder.group({
      designation:[item.designation,[Validators.required]],
      code:[item.code,[Validators.required]],
      taux:[item.taux,[Validators.required]],
      fdefault:[item.fDefaut]
    })
    this.displayfiche=true
  }
  deletedevise(id:string){
    this.devises=this.devises.filter(val=>val.idDevise!=id)

  }
  currentpointventefiche:Fichepointvente=new Fichepointvente()
  modiferpointventefiche(item:Fichepointvente){
    this.currentpointventefiche=item
    this.ficheForm=this._FormBuilder.group({
      designation:[item.designation,[Validators.required]],
      cordx:[item.cordx,[Validators.required]],
      cordy:[item.cordy,[Validators.required]],
      adresse:[item.adresse],
      gestiontable:[item.gestiontable,[Validators.required]],
      autoriserphoto:[item.autoriserphoto,[Validators.required]],
      clavier:[item.clavier,[Validators.required]],
      Imprimante:[item.Imprimante,[Validators.required]],
      autoriserpartage:[item.autoriserpartage,[Validators.required]],
      reimprimer:[item.reimprimer,[Validators.required]],
      autoriserimpression:[item.autoriserimpression,[Validators.required]],
      entetepiedticket:[item.entetepiedticket,[Validators.required]],
      Controlercaisse:[item.Controlercaisse],
      taxe:[item.taxe,[Validators.required]],
      taxeselected:[item.taxeselected,[Validators.required]],
      prixproduitrecu:[item.prixproduitrecu,[Validators.required]],
      paiment:[item.paiment,[Validators.required]],
      defaultouverture:[item.defaultouverture],
      differenceautorise:[item.differenceautorise],
      entete:[item.entete],
      pied:[item.pied],
      chiffrevirgule:[item.chiffrevirgule],
      fdetectPack:[item.fdetectPack==1],
      faffectEmployetoservice:[item.fAffectEmployetoservice],
      FautoriserRecharge:[item.fAutoriserRecharge],
      fdetailMontant:[item.fdetailMontant],
      fReservation:[item.fReservation],
      fEcranCuisine:[item.fEcranCuisine==1],
      typePv:[item.typePv],
      dateMiseCirc:[item.dateMiseCirc]
    })
    this.devises=[]
    this.taxes=[]
    item.devise.forEach(val=>{
      this.devises.push(val)
    })
    item.taxe.forEach(val=>{
      this.taxes.push(val)
    })
    this.fiche=false
  }

  deletepointventefiche(id:string){
    this.pointVentefiches=this.pointVentefiches.filter(val=>val.idFichepointvente!=id)
  }

  configcaisse(stepper){
    if(this.pointVentefiches.length==0){
      this.showToast(this.status,"Erreur", "Veuillez ajouter au moins  un Point Vente");
    }else{
      stepper.next()
    }
  }

  status: NbComponentStatus = 'danger';
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

  displaycaisse:boolean=false
  iscaisseFormSubmitted:boolean=false
  caissesFiches:CaisseperFiche[]=[]
  typecaisses:TypeCaisse[]=[]
currenetidpointvente:string=""
currentpointVentefiches:any
  addcaisse(){
    this.iscaisseFormSubmitted=true
    let caisse:Caisse=new Caisse()
    let caissesFiche:CaisseperFiche=new CaisseperFiche()
    caisse.reference=this.caisseForm.value.reference
    caisse.numCaisse=this.caisseForm.value.numCaisse
    caisse.idTypeCaisse=this.caisseForm.value.typeCaisse.idTypeCaisse
    console.log(this.currentcaisse);
    if(this.currentcaisse.caisse!=null){
     this.caissesFiches=this.caissesFiches.filter(val=>val.caisse.idCaisse!=this.currentcaisse.caisse.idCaisse)
      caisse.idCaisse=this.currentcaisse.caisse.idCaisse
      this.currentcaisse=new CaisseperFiche()
    }else{
      caisse.idCaisse=uuid.v4()
    }

    caissesFiche.idpointvente=this.currenetidpointvente
    caissesFiche.caisse=caisse
    this.caissesFiches.push(caissesFiche)
    console.log(this.caissesFiches);
    this.displaycaisse=false
    this.resetcaisseform()
    if(this.caisseForm.invalid){
        return
    }else{
      console.log(this.caisseForm.value)
    }
  }

  resetcaisseform(){
    this.caisseForm=this._FormBuilder.group({
      numCaisse:['',[Validators.required]],
      typeCaisse:['',[Validators.required]],
      reference:['',[Validators.required]]      
    })
    this.iscaisseFormSubmitted=false
  }

  splitlist(idpointvente:string){
    return this.caissesFiches.filter(val=>val.idpointvente==idpointvente)
  }

  splituserlist(idpointvente:string){
    return this.users.filter(val=>val.idPointVente==idpointvente)
  }

  currentcaisse:CaisseperFiche=new CaisseperFiche()
  editcaisse(item:CaisseperFiche,idpointvente:string){
    this.currentcaisse=item
    console.log(item);
    this.currenetidpointvente=idpointvente
    this.caisseForm=this._FormBuilder.group({
      numCaisse:[item.caisse.numCaisse,[Validators.required]],
      typeCaisse:[this.typecaisses.filter(val=>val.idTypeCaisse==item.caisse.idTypeCaisse)[0],[Validators.required]],
      reference:[item.caisse.reference,[Validators.required]]
    })
    this.displaycaisse=true
  }
  deletecaisse(id:string){
    this.caissesFiches=this.caissesFiches.filter(val=>val.caisse.idCaisse!=id)
  }
  currentuser:Utilisateur=new Utilisateur()
  edituser(item:Utilisateur,idpointvente:string){
    this.currentuser=item
    console.log(item);
    this.currenetidpointvente=idpointvente
    this.userForm=this._FormBuilder.group({
      nom:[item.nom,[Validators.required]],
      prenom:[item.prenom,[Validators.required]],
      login:[item.login,[Validators.required]],
      matricule:[item.matricule,[Validators.required]],
      identifiant:[item.identifiant,[Validators.required]],
      idTypeUtilisateur:[item.idTypeUtilisateur,[Validators.required]],
      idProfil:[item.idProfil],
      email:[item.email,[Validators.required,Validators.email,Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9]+.[a-zA-Z]+.[a-zA-Z]{2,3}$')]],
      password:[item.password,[Validators.required]],
      tel:[item.tel,[Validators.required]],
      adresse:[item.adresse,[Validators.required]],
      sexe:[this.sexe.filter(val=>val.value==item.sexe)[0].value,[Validators.required]]
    })
    this.displayuser=true
  }
  deleteuser(id:string){
    this.users=this.users.filter(val=>val.idUtilisateur!=id)
  }
  users:Utilisateur[]=[]
  adduser(){
    this.isuserFormSubmitted=true
    if(this.userForm.invalid){
      return
    }else{
      console.log(this.userForm.value);
      
      let user:Utilisateur=new Utilisateur()
      user.nom=this.userForm.value.nom
      user.prenom=this.userForm.value.prenom
      user.login=this.userForm.value.login
      user.identifiant=this.userForm.value.identifiant
      user.email=this.userForm.value.email
      user.matricule=this.userForm.value.matricule
      user.idTypeUtilisateur=this.userForm.value.idTypeUtilisateur.idTypeUtilisateur
      // user.idProfil=this.userForm.value.idProfil.idProfil
      user.password=this.userForm.value.password
      user.idPointVente=this.currenetidpointvente
      user.sexe=this.userForm.value.sexe
      user.adresse=this.userForm.value.adresse
      user.tel=this.userForm.value.tel
      if(this.users.filter(val=>val.login==user.login).length>0){
        this.showToast(this.status,"Erreur","le login est deja utiliser");

      }else{
        console.log(user);
      
        this.users.push(user)
        this.isuserFormSubmitted=false
        this.displayuser=false
        this.reseteuser()
      }

    }
  }
  reseteuser(){
    this.userForm=this._FormBuilder.group({
      nom:['',[Validators.required]],
      prenom:['',[Validators.required]],
      login:['',[Validators.required]],
      matricule:['',[Validators.required]],
      identifiant:['',[Validators.required]],
      idTypeUtilisateur:['',[Validators.required]],
      idProfil:[''],
      email:['',[Validators.required,Validators.email,Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9]+.[a-zA-Z]+.[a-zA-Z]{2,3}$')]],
      password:['',[Validators.required]],
      tel:['',[Validators.required]],
      adresse:['',[Validators.required]],
      sexe:[this.sexe[0].value,[Validators.required]]
    })
    this.isuserFormSubmitted=false
  }

  addtaxe(){
    this.istaxeFormSubmitted=true
    if(this.taxeForm.invalid){
      return
    }else{
      console.log(this.taxeForm.value);
      if(this.currenttaxe.idTaxe!=null){
        this.taxes=this.taxes.filter(val=>val.idTaxe!=this.currenttaxe.idTaxe)
      }
      console.log(this.taxes);
      let taxe:Taxe=new Taxe()
      taxe.porteeTaxe=this.taxeForm.value.porteeTaxe
      taxe.typeTaxe=this.taxeForm.value.typeTaxe
      taxe.valeur=this.taxeForm.value.valeur
      taxe.fDefault=this.taxeForm.value.fDefault   
      taxe.idPointVente=null
      taxe.idTaxe=uuid.v4()   
      this.taxes.push(taxe)
      this.istaxeFormSubmitted=false
      this.displaytaxe=false
      this.ficheForm.controls['taxeselected'].setValue(null)
      this.resetetaxe()
    }
  }
  resetetaxe(){
    this.taxeForm=this._FormBuilder.group({
      porteeTaxe:['',[Validators.required]],
      typeTaxe:['',[Validators.required]],
      valeur:['',[Validators.required]],
      fDefault:[false]
    })
    this.istaxeFormSubmitted=false
  }

  currenttaxe:Taxe=new Taxe();
  modifertaxe(taxe:Taxe){
    this.currenttaxe=taxe;
    this.taxeForm=this._FormBuilder.group({
      porteeTaxe:[taxe.porteeTaxe,[Validators.required]],
      typeTaxe:[taxe.typeTaxe,[Validators.required]],
      valeur:[taxe.valeur,[Validators.required]],
      fDefault:[taxe.fDefault]
    })
    this.displaytaxe=true
  }
  deletetaxe(id:string){
    this.taxes=this.taxes.filter(val=>val.idTaxe!=id)
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

  endstepper(){
    if(this.caissesFiches.length == 0){
      this.showToast(this.status,"Erreur", "Veuillez ajouter au moins  une Caisse");
    }else{
      if(this.users.length == 0){
        this.showToast(this.status,"Erreur", "Veuillez ajouter au moins  un Utilisateur");
      }else{
        this.loading=true
        console.log(this.partenaire);
        console.log(this.pointVentefiches);
        console.log(this.caissesFiches);
        console.log(this.users);
        if(this.files!=null){
          this._FileEndPointService.uplodeimage(this.files,this.uuids).subscribe(vel=>{
            console.log(vel);
            
          })
        }
        if(this.files2!=null){
          this._FileEndPointService.uplodeimage(this.files2,this.uuids).subscribe(vel=>{
            console.log(vel);
            
          })
        }
        this._PartenaireBpriceEndPointService.CreatePartenaireBprice(this.partenaire).subscribe(partenaire=>{
          console.log(partenaire);
          
          if(partenaire.result==1){
            let i:number=0
            this.product.ajoutePar = localStorage.getItem("UserId");
                this.product.idPartenaire = partenaire.objectResponse.idPartenaire;
                this.product.fAchete = 0;
                this.product.fVendu= 0;
                this.product.codeBarre= null
                this.product.dateCreation= new Date()
                this.product.fRacourci= 0;
                this.product.prixHt=0
                this.product.prixTtc= 0
                this.product.typeProduit="recharge"
                this.product.urlImg=this.files!=null?this.imagename:null
                this.product.description="recharge"
                this.product.designation="recharge"
                this.product.code=this.product.designation.toLocaleUpperCase()
                this.product.fautorisGerant=0
                //produtcate.produit=this.product
                let productsdto:Productsdto=new Productsdto()
                productsdto.produit=this.product
                productsdto.fournisseurs=[]
                productsdto.catgorieids=[]
                productsdto.pointVentes=[]
            this.pointVentefiches.forEach(pointvente=>{
              let pointVentedto:PointVentespriceDto=new PointVentespriceDto()

              let pointvent:PointVente=new PointVente()
              pointvent.adresse=pointvente.adresse
              pointvent.chiffrevirgule=pointvente.chiffrevirgule
              pointvent.coordX=pointvente.cordx
              pointvent.coordY=pointvente.cordy
              pointvent.dateCreation=new Date()
              pointvent.designation=pointvente.designation
              pointvent.enteteTicket=pointvente.entete
              pointvent.fActif=1
              pointvent.fClavierVirtuel=pointvente.clavier?1:0
              pointvent.fEntetePied=pointvente.entetepiedticket?1:0 
              pointvent.fGestionTable=pointvente.gestiontable?1:0
              pointvent.fImprimCuisine=pointvente.Imprimante?1:0
              pointvent.fPartageAdition=pointvente.autoriserpartage?1:0
              pointvent.fPhotoCateg=pointvente.autoriserphoto?1:0
              pointvent.fReImprim=pointvente.reimprimer?1:0
              pointvent.fdetailMontant=pointvente.fdetailMontant?1:0
              pointvent.idPartenaire=partenaire.objectResponse.idPartenaire
              pointvent.piedTicket=pointvente.pied
              pointvent.fImprimeAvP=pointvente.autoriserimpression?1:0
              pointvent.fControlCaisse=pointvente.Controlercaisse?1:0
              pointvent.modeReglements=pointvente.paiment
              pointvent.defaultouverture=pointvente.defaultouverture
              pointvent.differenceautorise=pointvente.differenceautorise
              pointvent.fprixttc=pointvente.prixproduitrecu
              pointvent.fdetectPack=pointvente.fdetectPack?1:0
              pointvent.fAffectEmployetoservice=pointvente.fAffectEmployetoservice?1:0
              pointvent.fAutoriserRecharge=pointvente.fAutoriserRecharge?1:0
              pointvent.fReservation=pointvente.fReservation?'1':'0'
              pointvent.fEcranCuisine=pointvente.fEcranCuisine?1:0
              pointvent.typePv=pointvente.typePv
              pointvent.dateMiseCirc=pointvente.dateMiseCirc
      
              console.log(pointvent);
              
              this._PointVenteEndPointService.CreatePointVente(pointvent).subscribe(point=>{
                i=i+1
                console.log(point);
                //this.product = this.productForm.value;
                pointVentedto.idpointvente=point.objectResponse.idPointVente
                pointVentedto.visible=1
                pointVentedto.price=0
                productsdto.pointVentes.push(pointVentedto)

                if(point.result==1){
                  pointvent.modeReglements.forEach(modereg=>{
                    modereg.idPointVente=point.objectResponse.idPointVente
                    this._ModeReglementEndPointService.CreateModeReglement(modereg).subscribe(val=>{
                      console.log(val);
                    })


                  })
                  pointvente.devise.forEach(devise=>{
                    let devis:Devise=new Devise()
                    devise.designation=devise.designation
                    devis.code=devise.code
                    devis.taux=devise.taux
                    devis.fDefaut=devise.fDefaut?1:0
                    devis.idPointVente=point.objectResponse.idPointVente
                    console.log(devis);
                    
                    this._DeviseEndPointService.CreateDevise(devis).subscribe(result=>{
                      console.log(result);
                      if(result.result!=1){
                        this.showToast(this.status,"Erreur",result.errorDescription);
                      }
                    },erreur=>{
                      this.showToast(this.status,"Erreur",erreur);
                    })
                  })
                  pointvente.taxe.forEach(t=>{
                    let tax:Taxe=new Taxe()
                    tax.fActif=1
                    tax.fDefault=0
                    tax.idPointVente=point.objectResponse.idPointVente
                    tax.porteeTaxe=t.porteeTaxe
                    tax.typeTaxe=t.typeTaxe
                    tax.valeur=t.valeur
                    if(t.idTaxe==pointvente.taxeselected.idTaxe){
                      tax.fDefault=1
                    }
                    this._TaxeEndPoinrService.CreateTaxe(tax).subscribe(val=>{
                      console.log(val);
                      if(val.result!=1){
                        this.showToast(this.status,"Erreur",val.errorDescription);
                        this.loading=false
                      }
                    },erreur=>{
                      this.showToast(this.status,"Erreur",erreur);
                      this.loading=false
                    })
                  })
                  this.caissesFiches.forEach(caisse=>{
                    if(caisse.idpointvente==pointvente.idFichepointvente){
                      let caisse1:Caisse=new Caisse()
                      caisse1.fActif=1
                      caisse1.dateCreation=new Date()
                      caisse1.idPointVente=point.objectResponse.idPointVente
                      caisse1.numCaisse=caisse.caisse.numCaisse
                      caisse1.reference=caisse.caisse.reference
                      caisse1.idTypeCaisse=caisse.caisse.idTypeCaisse
                      this._CaisseEndPointService.CreateCaisse(caisse1).subscribe(val=>{
                        console.log(val);
                        if(val.result!=1){
                          this.showToast(this.status,"Erreur",val.errorDescription);
                          this.loading=false
                        }
                      },erreur=>{
                        this.showToast(this.status,"Erreur",erreur);
                        this.loading=false
                      })
                    }
                  })
                 // pointvente.
                 console.log(this.users);
                 
                  this.users.forEach(user=>{
                    console.log(user.idPointVente);
                    console.log(pointvente.idFichepointvente);
                    console.log(user.idPointVente==pointvente.idFichepointvente);
                    
                    if(user.idPointVente==pointvente.idFichepointvente){
                      let utilisateur:Utilisateur=new Utilisateur
                      utilisateur.email=user.email
                      utilisateur.fActif=1
                      utilisateur.idPartenaire=partenaire.objectResponse.idPartenaire
                      utilisateur.idPointVente=point.objectResponse.idPointVente
                      // utilisateur.idProfil=user.idProfil
                      utilisateur.idTypeUtilisateur=user.idTypeUtilisateur
                      utilisateur.identifiant=user.identifiant
                      utilisateur.login=user.login
                      utilisateur.matricule=user.matricule
                      utilisateur.nom=user.nom
                      utilisateur.password=user.password
                      utilisateur.prenom=user.prenom
                      utilisateur.dateCreation=new Date()
                      utilisateur.isvalidated=0
                      utilisateur.sexe=user.sexe
                      utilisateur.tel=user.tel
                      utilisateur.adresse=user.adresse
                      console.log(utilisateur);
                      this._UtilisateurEndPointService.CreateUtilisateur(utilisateur).subscribe(userreulst=>{
                        console.log(userreulst);
                        if(userreulst.result!=1){
                          this.showToast(this.status,"Erreur",userreulst.errorDescription);
                          this.loading=false
                        }
                      },erreur=>{
                        this.showToast(this.status,"Erreur",erreur);
                        this.loading=false
                      })
                    }
                  })

                }else{
                    this.showToast(this.status,"Erreur",point.errorDescription);
                    this.loading=false
                }
                if(i==this.pointVentefiches.length && this.loading==true){
                  this._ProductEndPointService.createProductwithaffectation(productsdto).subscribe(ee=>{
                    console.log(ee);
                    return this.router.navigateByUrl("/pages/dashboard");                    
                  })
                }
              },erreur=>{
                this.showToast(this.status,"Erreur",erreur);
                this.loading=false
              })
            })
          }else{
            this.showToast(this.status,"Erreur",partenaire.errorDescription);
            this.loading=false
          }
        },erreur=>{
          this.showToast(this.status,"Erreur",erreur);
          this.loading=false
        }) 
      }
    }
    
  }
  autocomp:boolean=false
  selectEvent(item:Devise){
    console.log(item);
    this.deviseForm.controls['code'].setValue(item.code)
    this.deviseForm.controls['designation'].setValue(item.designation)
    this.autocomp=true
  }
  onChangeSearch(event){
    console.log(event);
    this.deviseForm.controls['code'].setValue(null)
    if(event!=null && event!=''){
      this.deviseForm.controls['designation'].setValue(event)
    }else{
      this.deviseForm.controls['designation'].setValue(null)

    }

    this.autocomp=false

  }
  map:any;
  showmap:boolean=false;
  markerIcon = {
    icon: L.icon({
      iconSize: [25, 41],
      iconAnchor: [10, 41],
      popupAnchor: [2, -40],
      // specify the path here
      iconUrl: "https://unpkg.com/leaflet@1.5.1/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.5.1/dist/images/marker-shadow.png"
    })
  };

  openamp(){
    this.displaymap=true
    
    setTimeout(()=>{
      this.map = L.map('map2').setView([35.8314596,10.5914515], 8);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map);
      var marker
      this.map.on('click', e => {
        console.log(e.latlng);
        // console.log()
        // console.log(this.ficheForm.controls['cordy'])
        this.ficheForm.controls['cordx'].setValue(e.latlng.lat)
        this.ficheForm.controls['cordy'].setValue(e.latlng.lng)
        if(marker!=null){
          this.map.removeLayer(marker);
        }
        marker=L.marker([e.latlng.lat, e.latlng.lng], this.markerIcon).addTo(this.map); // add the marker onclick
        

      })
    },0)
    
  }
}
