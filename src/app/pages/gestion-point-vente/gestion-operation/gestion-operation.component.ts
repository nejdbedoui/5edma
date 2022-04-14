import { Component, OnInit } from '@angular/core';
import { Operation } from '../../../model/Operation';
import { Router } from '@angular/router';
import { GlobalServiceService } from '../../../service/GlobalService/global-service.service';
import { TableCaisse } from '../../../model/TableCaisse';
import { OperationEndPointService } from '../../../service/bp-api-transaction/operation-end-point/operation-end-point.service';
import { OperationTypeEndPointService } from '../../../service/bp-api-transaction/operation-type-end-point/operation-type-end-point.service';
import { OperationType } from '../../../model/OperationType';
import { CaisseEndPointService } from '../../../service/bp-api-pos/caisse-end-point/caisse-end-point.service';
import { Caisse } from '../../../model/Caisse';

@Component({
  selector: 'ngx-gestion-operation',
  templateUrl: './gestion-operation.component.html',
  styleUrls: ['./gestion-operation.component.scss']
})
export class GestionOperationComponent implements OnInit {

  constructor(private route:Router,private _OperationEndPointService:OperationEndPointService,
    private _GlobalService:GlobalServiceService,private _OperationTypeEndPointService:OperationTypeEndPointService,
    private _CaisseEndPointService:CaisseEndPointService) { }
  operation:Operation[]=[]
  cols:any[]
  loading:boolean=true
  currentoperation:Operation=new Operation();
  diplay:boolean=false;
  operationtypes:OperationType[]=[]
  caisses:Caisse[]=[];
  ngOnInit() {
    this.cols = [
      { field: 'Capacité de la Table', header: 'Capacité de la Table' },
      { field: 'Numéro de la Table', header: 'Numéro de la Table' },
      { field: 'Capacité de la Table', header: 'Capacité de la Table' },
      { field: 'Numéro de la Table', header: 'Numéro de la Table' },
      { field: 'Numéro de la Table', header: 'Numéro de la Table' },
      { field: 'Action', header: 'Action' },
  ];
  this.getallcaissebypointvente();
  this.getoperationtype();
    this._OperationEndPointService.findByIdPointVente(localStorage.getItem("pointventeid")).subscribe(val=>{
      console.log(val);
      this.loading=false
      this.operation=val.objectResponse!=null?val.objectResponse:[]
      this.operation=this.operation.sort((a,b)=>{
        return new Date(b.dateOperation).getTime()-new Date(a.dateOperation).getTime()
      })
      console.log(this.operation);
    })
  }

  getoperationtype(){
    this._OperationTypeEndPointService.findAllOperationType().subscribe(val=>{
      this.operationtypes=val.objectResponse!=null?val.objectResponse:[]
    })
  }
  findcaisse(idcaisse:string){
    let caisse=this.caisses.find(el=>el.idCaisse==idcaisse);
    return  caisse!=null?caisse.reference:''
  }
  findoperationtype(idoperationtype:string){
    let operationtype=this.operationtypes.find(el=>el.idTypeOperation==idoperationtype)
    return  operationtype!=null?operationtype.designation:''
  }

  getallcaissebypointvente(){
    this._CaisseEndPointService.findAllCaisseByidPointVente(localStorage.getItem("pointventeid")).subscribe(val=>{
      this.caisses=val.objectResponse!=null?val.objectResponse:[]
    })
  }
  addoperation(){
    this.route.navigateByUrl("/pages/Pointvente/gestionOperation/NouvelleOperation")
  }
  editoperation(operation:Operation){
    this.route.navigateByUrl("/pages/Pointvente/gestionOperation/ModifierOperation/"+operation.idOperation)
  }

  supprimeoperation(operation:Operation){
    this.diplay=true
    this.currentoperation=operation
  }
  deleteoperation(){
    this.operation=this.operation.filter(val=>val.idOperation!=this.currentoperation.idOperation);
    this._OperationEndPointService.DeleteOperation(this.currentoperation.idOperation).subscribe(val=>{
      console.log(val);
      if(val.result==1){
        this._GlobalService.showToast("success","success","l'opération a été supprimé avec succès")
      }else{
        this._GlobalService.showToast('danger','Erreur',val.errorDescription)
      }
    },errur=>{
      this._GlobalService.showToast('danger','Erreur',"Un problème de connection est survenue, Veuillez réessayer ulterieurement")
    })
  }

}
