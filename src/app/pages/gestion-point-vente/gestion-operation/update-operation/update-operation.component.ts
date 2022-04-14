import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { GlobalServiceService } from '../../../../service/GlobalService/global-service.service';
import { CaisseEndPointService } from '../../../../service/bp-api-pos/caisse-end-point/caisse-end-point.service';
import { OperationTypeEndPointService } from '../../../../service/bp-api-transaction/operation-type-end-point/operation-type-end-point.service';
import { OperationEndPointService } from '../../../../service/bp-api-transaction/operation-end-point/operation-end-point.service';
import { Caisse } from '../../../../model/Caisse';
import { Operation } from '../../../../model/Operation';
import { OperationType } from '../../../../model/OperationType';
import { FournisseurEndPointService } from '../../../../service/bp-api-product/fournisseur-end-point/fournisseur-end-point.service';
import { Fournisseur } from '../../../../model/dto/Fournisseur';
import { Utilisateur } from '../../../../model/Utilisateur';
import { UtilisateurEndPointService } from '../../../../service/bp-api-admin/utilisateur-end-point/utilisateur-end-point.service';

@Component({
  selector: 'ngx-update-operation',
  templateUrl: './update-operation.component.html',
  styleUrls: ['./update-operation.component.scss']
})
export class UpdateOperationComponent implements OnInit {

 
 
  constructor(private _FormBuilder:FormBuilder,
    private router:Router,private _GlobalServiceService:GlobalServiceService,
    private _CaisseEndPointService:CaisseEndPointService,
    private _OperationTypeEndPointService:OperationTypeEndPointService,
    private _OperationEndPointService:OperationEndPointService,private route:ActivatedRoute,
    private _FournisseurEndPointService:FournisseurEndPointService,
    private _UtilisateurEndPointService:UtilisateurEndPointService) { }
  operationForm:FormGroup;
  loading:boolean=false
  isFormSubmitted:boolean=false;
  id:string = this.route.snapshot.paramMap.get('id');

    caisses:Caisse[]=[];
    operationstypes:OperationType[]=[];
    operation:Operation=new Operation();
    fournisseurs:Fournisseur[]=[];
    ngOnInit() {
      this.operationForm=this._FormBuilder.group({
        CaisseD:[''],
        CaisseC:[''],
        type: ['',[Validators.required]],
        montant: ['',[Validators.required]],
        commenatire:[''],
        numcommantaire:[''],
        fournisseurid:[''],
        employerid:[],
        date:[new Date()]
      })
      this.findallcaissebyidpoitvente();
      
    }
    findallcaissebyidpoitvente(){
      this._CaisseEndPointService.findAllCaisseByidPointVente(localStorage.getItem('pointventeid')).subscribe(res=>{
        this.caisses=res.objectResponse!=null?res.objectResponse:[];
        console.log(this.caisses);
        this.getEmployer();
        
      })
    }

    getfournisseur(){
      this._FournisseurEndPointService.findAllByIdPatenaireBprice(localStorage.getItem('partenaireid')).subscribe(res=>{
        this.fournisseurs=res.objectResponse!=null?res.objectResponse:[]
        this.findaltypeoperation();
      })
    }

    findaltypeoperation(){
      this._OperationTypeEndPointService.findAllOperationType().subscribe(res=>{
        this.operationstypes=res.objectResponse!=null?res.objectResponse:[];
        console.log(this.operationstypes);
        
        this.findOpearationbyid(this.id);
      })
    }
        
    findOpearationbyid(id:string){
      this._OperationEndPointService.findByIdOperation(id).subscribe(res=>{
        console.log(res);
        
        this.operation=res.objectResponse;
        this.operationForm=this._FormBuilder.group({
          CaisseD:[this.operation.idCaisse!=null && this.operation.idCaisse!='' ?this.caisses.find(caisse=>caisse.idCaisse==this.operation.idCaisse).idCaisse:''],
          CaisseC:[this.operation.caiIdCaisse!=null && this.operation.caiIdCaisse!=''?this.caisses.find(caisse=>caisse.idCaisse==this.operation.caiIdCaisse).idCaisse:''],
          type: [this.operationstypes.find(type=>type.idTypeOperation==this.operation.idTypeOperation),[Validators.required]],
          montant: [this.operation.montant,[Validators.required]],
          commenatire:[this.operation.commenatire],
          numcommantaire:[this.operation.numCommande],
          fournisseurid:[this.fournisseurs.find(fournisseur=>fournisseur.idFournisseur==this.operation.idFournisseur)!=null?this.fournisseurs.find(fournisseur=>fournisseur.idFournisseur==this.operation.idFournisseur).idFournisseur:''],
          employerid:[this.operation.idEmploye],
          date:[new Date(this.operation.dateOperation)],
        })
      })
    }

    addoperation(){
      this.isFormSubmitted=true
      let conditionverifier:boolean=false;
      if(this.operationForm.value.type.designation=="avoir" && this.operationForm.value.numcommantaire!=null && this.operationForm.value.numcommantaire!=''
      && this.operationForm.value.commenatire!=null && this.operationForm.value.commenatire!=''){
        conditionverifier=true        
      }else if(this.operationForm.value.type.designation=="transfert" && this.operationForm.value.CaisseD!=null && this.operationForm.value.CaisseD!=''
      && this.operationForm.value.CaisseC!=null && this.operationForm.value.CaisseC!=''
      && this.operationForm.value.commenatire!=null && this.operationForm.value.commenatire!=''){
        conditionverifier=true
      }else if(this.operationForm.value.type.designation=="paiement facture" || this.operationForm.value.type.designation=="avance"
      || this.operationForm.value.type.designation=="prime" || this.operationForm.value.type.designation=="salaire"){        conditionverifier=true
      }
      if(this.operationForm.invalid || !conditionverifier){
        return
      }else{
        this.loading=true
        console.log(this.operationForm.value);
        let operation:Operation=new Operation();
        if(this.operationForm.value.type.designation=="transfert"){
          operation.caiIdCaisse=this.operationForm.value.CaisseD
          operation.idCaisse=this.operationForm.value.CaisseC
        }else{
          operation.caiIdCaisse=null
          operation.idCaisse=null
        }
        
        operation.idTypeOperation=this.operationForm.value.type.idTypeOperation
        operation.commenatire=this.operationForm.value.commenatire
        operation.statut=null
        operation.dateOperation=this.operationForm.value.date;
        operation.idPointVente=localStorage.getItem("pointventeid")
        operation.idUtilisateur=localStorage.getItem("UserId")
        operation.montant=this.operationForm.value.montant
        operation.idFournisseur=this.operationForm.value.fournisseurid
        operation.numCommande=this.operationForm.value.numcommantaire
        operation.idOperation=this.id
        operation.idEmploye = this.operationForm.value.employerid

        this._OperationEndPointService.CreateOperation(operation).subscribe(val=>{
          this.loading=false
          console.log(val);
          
          if(val.result==1){
            this._GlobalServiceService.showToast('success','Succès',"l'opération a été modifier avec succès")

            this.router.navigateByUrl("/pages/Pointvente/gestionOperation")
          }else{
            
            this._GlobalServiceService.showToast('danger','Erreur',val.errorDescription)
          }
        },erreur=>{
          this.loading=false
          this._GlobalServiceService.showToast('danger','Erreur',erreur)
  
        })
      }
    }
    get formControls() { return this.operationForm.controls; }
  
  returntolist(){
    this.router.navigateByUrl("/pages/Pointvente/gestionOperation")
  }

  utilisateurs:Utilisateur[]=[]
  getEmployer(){
    this._UtilisateurEndPointService.findAllByIdPointVente(localStorage.getItem("pointventeid")).subscribe(res=>{
      this.loading=false
      console.log(res);
      this.getfournisseur()
      if(res.result==1){
        this.utilisateurs=res.objectResponse
      }
    })
  }
  }
  
  
