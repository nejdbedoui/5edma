import { Component, OnInit } from '@angular/core';
import { TableCaisseEndPointService } from '../../../../service/bp-api-pos/table-caisse-end-point/table-caisse-end-point.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PointVenteEndPointService } from '../../../../service/bp-api-pos/point-vente-end-point/point-vente-end-point.service';
import { Router, ActivatedRoute } from '@angular/router';
import { GlobalServiceService } from '../../../../service/GlobalService/global-service.service';
import { PointVente } from '../../../../model/PointVente';
import { TableCaisse } from '../../../../model/TableCaisse';

@Component({
  selector: 'ngx-update-table',
  templateUrl: './update-table.component.html',
  styleUrls: ['./update-table.component.scss']
})
export class UpdateTableComponent implements OnInit {

  constructor(private _TableCaisseEndPointService:TableCaisseEndPointService,private _FormBuilder:FormBuilder,
    private _PointVenteEndPointService:PointVenteEndPointService,private router:Router,private _GlobalServiceService:GlobalServiceService,
    private route:ActivatedRoute) { }
tableForm:FormGroup;
points:PointVente[]=[]
loading:boolean=false
istableFormSubmitted:boolean=false
id:string = this.route.snapshot.paramMap.get('id');
table:TableCaisse=new TableCaisse()
Types=[{label:'Carrée',value:'Carrée'},{label:'Rectangulaire',value:'Rectangulaire'},{label:'Circulaire',value:'Circulaire'}];

  ngOnInit() {
    this.tableForm=this._FormBuilder.group({
      idPointVente:[localStorage.getItem("pointventeid")],
      numTable:['',[Validators.required]],
      capaciteTable:['',[Validators.required]],
      typeTable: [],
      description: [],
      etat:["libre"]
    })
    this._PointVenteEndPointService.findAllByIdPartenaireBprice(localStorage.getItem("partenaireid")).subscribe(val=>{
      if(val.result==1){
        this.points=val.objectResponse
        this._TableCaisseEndPointService.findByIdTableCaisse(this.id).subscribe(res=>{
          this.table=res.objectResponse
          this.tableForm=this._FormBuilder.group({
            idPointVente:[localStorage.getItem("pointventeid")],
            numTable:[this.table.numTable,[Validators.required]],
            capaciteTable:[this.table.capaciteTable,[Validators.required]],
            typeTable: [this.Types.filter(el=>el.value==this.table.typeTable)[0].value],
            description: [this.table.description],
            etat:[this.table.etat]
          })
        })
      }
    })
  }

  addtable(){
    this.istableFormSubmitted=true
    this.loading=true
    if(this.tableForm.invalid){
      return
    }else{
      let tab:TableCaisse=new TableCaisse()
      tab=this.tableForm.value
      tab.idTable=this.table.idTable
      this._TableCaisseEndPointService.CreateTableCaisse(tab).subscribe(val=>{
        this.loading=false
        console.log(val);
        
        if(val.result==1){
          this.router.navigateByUrl("/pages/Pointvente/gestionTable")
        }else{
          this._GlobalServiceService.showToast('danger','Erreur',val.errorDescription)
        }
      },erreur=>{
        this._GlobalServiceService.showToast('danger','Erreur',erreur)

      })
    }
  }
  get formControls() { return this.tableForm.controls; }

  returntolist(){
    this.router.navigateByUrl("/pages/Pointvente/gestionTable")
  }
}
