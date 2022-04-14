import { Component, OnInit } from '@angular/core';
import { PointVenteEndPointService } from '../../../../service/bp-api-pos/point-vente-end-point/point-vente-end-point.service';
import { Router, ActivatedRoute } from '@angular/router';
import { GlobalServiceService } from '../../../../service/GlobalService/global-service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateService } from '../../../../service/GlobalService/DateSevice/date.service';
import { TableCaisseEndPointService } from '../../../../service/bp-api-pos/table-caisse-end-point/table-caisse-end-point.service';
import { UtilisateurEndPointService } from '../../../../service/bp-api-admin/utilisateur-end-point/utilisateur-end-point.service';
import { CustomerEndPointService } from '../../../../service/bp-api-customer/customer-end-point/customer-end-point.service';
import { BpApiReservationService } from '../../../../service/bp-api-reservation/bp-api-reservation.service';
import { ProduitProintVenteEndPointService } from '../../../../service/bp-api-product/produit-proint-vente-end-point/produit-proint-vente-end-point.service';
import { PointVente } from '../../../../model/PointVente';
import { TableCaisse } from '../../../../model/TableCaisse';
import { Clientpartenaire } from '../../../../model/Clientpartenaire';
import { Utilisateur } from '../../../../model/Utilisateur';
import { VProduitProduitpointvente } from '../../../../model/VProduitProduitpointvente';
import { ReservationDto } from '../../../../model/dto/ReservationDto';
import { TableReservationDto } from '../../../../model/TableReservationDto';
import { SearchClientDto } from '../../../../model/dto/SearchClientDto';
import { Quantite } from '../../../../model/Quantite';

@Component({
  selector: 'ngx-edit-rendez-vous',
  templateUrl: './edit-rendez-vous.component.html',
  styleUrls: ['./edit-rendez-vous.component.scss']
})
export class EditRendezVousComponent implements OnInit {

 
  constructor(private _PointVenteEndPointService:PointVenteEndPointService,private router:Router,
    private _GlobalService:GlobalServiceService,private _FormBuilder:FormBuilder,private _DateService:DateService,
    private _TableCaisseEndPointService:TableCaisseEndPointService,private _UtilisateurEndPointService:UtilisateurEndPointService,
    private _CustomerEndPointService:CustomerEndPointService,private _BpApiReservationService:BpApiReservationService,
    private _ProduitProintVenteEndPointService:ProduitProintVenteEndPointService,private route:ActivatedRoute) { }
  pointVenteId:string = localStorage.getItem('pointventeid');
  rdvForm:FormGroup;
  pointvente:PointVente=new PointVente()
  isDateChecked:boolean=true
  isSubmitted:boolean=false
  tables:TableCaisse[]=[]
  Consommateurs:Clientpartenaire[]=[]
  employees:Utilisateur[]=[]
  keyword = 'nom';
  produitpointventes:VProduitProduitpointvente[]=[]
  id:string = this.route.snapshot.paramMap.get('id');
  rdv:any;
  loading:boolean=true
  customer:any
  ngOnInit() {
    this.rdvForm = this._FormBuilder.group({
      dateReseravation:[null,[Validators.required]],
      dateFinReseravation:[null],
      idConsommateur:['',[Validators.required]],
      idTable:[''],
      idemployee:[''],
      nbrPers:[0,[Validators.required]],
      idproduitPointVente:[''],
      idproduit:['']
    })
    this._ProduitProintVenteEndPointService.findAllProduitPointVenteByIdPointVente(this.pointVenteId).subscribe(el=>{
      console.log(el);
      
      this.produitpointventes=el.objectResponse
      console.log(this.produitpointventes);
      this._PointVenteEndPointService.findPointVenteByIdPointVente(this.pointVenteId).subscribe(val=>{
        this.pointvente=val.objectResponse
        console.log(val.objectResponse);
        this._CustomerEndPointService.findAllActiveClientByPartenaire(localStorage.getItem('partenaireid')).subscribe(cust=>{
          console.log(cust);
          
          this._BpApiReservationService.findReservationById(this.id).subscribe(vel=>{
            console.log(vel);
            this.rdv=vel.objectResponse
                       
            this.customer=cust.objectResponse.filter(ell=>ell.idClientPartenaire==this.rdv.idConsommateur)[0]
            if(this.pointvente.fGestionTable==1){
              let tablereseve:TableReservationDto=new TableReservationDto()
              tablereseve.idPointVente=this.pointVenteId
              tablereseve.datereservation=new Date(this.rdv.dateReseravation)
              this._TableCaisseEndPointService.findByIdTableCaisse(this.rdv.idTable).subscribe(table=>{
              this._TableCaisseEndPointService.findfreetablebyreservation(tablereseve).subscribe(val2=>{
                // if(val.result==1){
                  this.tables=[]
                  this.tables=val2.objectResponse!=null?val2.objectResponse:[]

                    this.tables.push(table.objectResponse)
                    setTimeout(() => {
                      this.rdvForm = this._FormBuilder.group({
                        dateReseravation:[new Date(this.rdv.dateReseravation),[Validators.required]],
                        dateFinReseravation:[this.rdv.dateFinReseravation!=null?new Date(this.rdv.dateFinReseravation):null],
                        idConsommateur:[cust.objectResponse.filter(ell=>ell.idClientPartenaire==this.rdv.idConsommateur)[0].nom,[Validators.required]],
                        idTable:[this.tables.filter(el2=>el2.idTable==this.rdv.idTable)[0].idTable],
                        idemployee:[''],
                        nbrPers:[this.rdv.nbrPers,[Validators.required]],
                        idproduitPointVente:[this.rdv.produitsQtes!=null?this.rdv.produitsQtes.idProduit:null],
                        idproduit:[this.rdv.produitsQtes!=null && this.rdv.produitsQtes[0]!=null?this.produitpointventes.filter(el=>el.produitpointvente.idproduitPointVente==this.rdv.produitsQtes[0].idProduit)[0].produitpointvente.idproduitPointVente:null]
                      }) 
                      this.loading=false
                    }, 0);
                    
                  })
                // }else{
                //   this.tables=[]
                //   this.loading=false
                // }
                
                
              })
            }else{
              let tablereseve:TableReservationDto=new TableReservationDto()
              tablereseve.idPointVente=this.pointVenteId
              tablereseve.datereservation=new Date(this.rdv.dateReseravation)
              this._UtilisateurEndPointService.findfreeemplyeebyreservation(tablereseve).subscribe(val=>{
                console.log(val);
                if(val.result==1){
                  this.employees=val.objectResponse
                }else{
                  this.employees=[]
                }
                this.employees.push(this.rdv.employee)
                this.rdvForm = this._FormBuilder.group({
                  dateReseravation:[new Date(this.rdv.dateReseravation),[Validators.required]],
                  dateFinReseravation:[this.rdv.dateFinReseravation!=null?new Date(this.rdv.dateFinReseravation):null],
                  idConsommateur:[cust.objectResponse.filter(ell=>ell.idClientPartenaire==this.rdv.idConsommateur)[0].nom,[Validators.required]],
                  idTable:[''],
                  idemployee:[this.employees.filter(el3=>el3.idUtilisateur==this.rdv.employee.idUtilisateur)[0].idUtilisateur],
                  nbrPers:[0,[Validators.required]],
                  idproduitPointVente:[this.rdv.produitsQtes!=null?this.rdv.produitsQtes.idProduit:null],
                  idproduit:[this.rdv.produitsQtes!=null?this.produitpointventes.filter(el=>el.produitpointvente.idproduitPointVente==this.rdv.produitsQtes[0].idProduit)[0].produitpointvente.idproduitPointVente:null]
                }) 
                this.loading=false
                  console.log(this.employees);
                  
                  
              })
            }
          })
        })
      })
    })
    // let search:SearchClientDto=new SearchClientDto()
    // search.idPartner=localStorage.getItem('partenaireid');
    // search.rechercheValue='k'
    // this._CustomerEndPointService.searchClientbyIdPartenaire(search).subscribe(el=>{
    //   this.Consommateurs=el.objectResponse
    //   console.log(el.objectResponse);
      
    // })
    
    
  }
  get formControls() { return this.rdvForm.controls; }

  createRDV(){
    this.isSubmitted=true

    if(this.rdvForm.value.dateFinReseravation!=null){
      console.log(this.rdvForm.value.dateFinReseravation);
      console.log(this.rdvForm.value.dateReseravation);
      this.isDateChecked=this.checkDate(this.rdvForm.value.dateFinReseravation,this.rdvForm.value.dateReseravation)
      console.log(this.isDateChecked);
    }else{
      this.isDateChecked=true
    }
    console.log(this.rdvForm);
    
    if(this.rdvForm.invalid || !this.isDateChecked ){
      return
    }else{
      console.log(this.rdvForm.value)
      let reservation :ReservationDto=new ReservationDto()
      reservation.idPointVente=this.pointVenteId
      reservation.idConsommateur=this.customer.idClientPartenaire
      reservation.fTraite=0
      reservation.src="backoffice"
      reservation.dateReseravation=this.rdvForm.value.dateReseravation
      reservation.idReservation=this.id
      //reservation.dateFinReseravation=this.rdvForm.value.dateFinReseravation
      if(this.pointvente.fGestionTable==1){
        reservation.idTable=this.rdvForm.value.idTable
        reservation.nbrPers=this.rdvForm.value.nbrPers
      }else{
        reservation.idEmployeeService=this.rdvForm.value.idemployee
        let quantite:Quantite=new Quantite()
        reservation.produitsQtes=[]
        quantite.idProduit =this.rdvForm.value.idproduit
        quantite.quantite=1
        reservation.produitsQtes.push(quantite)
      }
      console.log(reservation);
      this.loading=true
      this._BpApiReservationService.updateReservation(reservation).subscribe(val=>{
        console.log(val);
        
        if(val.result==0){
          this._GlobalService.showToast('success',"success","le RDV a été ajouté avec succès")
          this.annuler()
          this.loading=false
        }else{
          this._GlobalService.showToast('danger',"Erruer",val.errorDescription)
          //this.annuler()
          this.loading=false
        }
      },erruer=>{
        this._GlobalService.showToast('danger',"Erruer","Un problème de connection est survenue, Veuillez réessayer ulterieurement")
        this.annuler()
        this.loading=false
      })
    }
  }
  checkDate(date1:Date,date2:Date){
    if(this._DateService.deletezonehour(date1).getTime()>=this._DateService.deletezonehour(date2).getTime()){
      return true;
    }else{
      return false;
    }
  }

  annuler(){
    this.router.navigateByUrl("/pages/Pointvente/gestionRendezVous")
  }

  choosedate(date:Date){
    console.log(date);
    if(this.pointvente.fGestionTable==1){
      let tablereseve:TableReservationDto=new TableReservationDto()
      tablereseve.idPointVente=this.pointVenteId
      tablereseve.datereservation=date
      this._TableCaisseEndPointService.findfreetablebyreservation(tablereseve).subscribe(val=>{
        if(val.result==1){
          this.tables=val.objectResponse
        }else{
          this.tables=[]
        }
      })
    }else{
      let tablereseve:TableReservationDto=new TableReservationDto()
      tablereseve.idPointVente=this.pointVenteId
      tablereseve.datereservation=date
      this._UtilisateurEndPointService.findfreeemplyeebyreservation(tablereseve).subscribe(val=>{
        console.log(val);
        if(val.result==1){
          this.employees=val.objectResponse
        }else{
          this.employees=[]
        }
          console.log(this.employees);
          
      })
    }
  }
  getname(item:Clientpartenaire){
    return item.nom+' '+ item.prenom
  }
  selectEvent(item) {    
    // do something with selected item
    console.log(item);
    
    this.customer=item
  }
 
  onChangeSearch(val: string) {
    console.log(val);
    let search:SearchClientDto=new SearchClientDto()
    search.idPartner=localStorage.getItem('partenaireid');
    search.rechercheValue=val
    this._CustomerEndPointService.searchClientbyIdPartenaire(search).subscribe(el=>{
      console.log(el);
      
      if(el.objectResponse!=null){
        this.Consommateurs=el.objectResponse

      }else{
        this.Consommateurs=[]

      }
      console.log(el.objectResponse);
      
    })
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }
  cleardata(event){
  }
  
  onFocused(e){
    // do something when input is focused
  }

}
