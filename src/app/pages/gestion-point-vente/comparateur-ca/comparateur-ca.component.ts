import { log } from 'util';
import { Component, OnInit } from '@angular/core';
import { FormArray, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { datasetDto } from '../../../model/dto/datasetDTO';
import { multiAxisData } from '../../../model/dto/multiAxisData';
import { PointVenteEndPointService } from '../../../service/bp-api-pos/point-vente-end-point/point-vente-end-point.service';
import { PointVente } from '../../../model/PointVente';
import { PartnerAnalyticsEndPointService } from '../../../service/bp-api-analytics/partner-analytics-end-point/partner-analytics-end-point.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'ngx-comparateur-ca',
  templateUrl: './comparateur-ca.component.html',
  styleUrls: ['./comparateur-ca.component.scss']
})
export class ComparateurCaComponent implements OnInit {
  choixCompare = [
    { value: '0', label: 'comparaison pour un seul point de vente' },
    { value: '1', label: 'comparaison entre plusieurs points de vente' }
  ];
  CompareLevel1 = [
    { value: '0', label: 'comparaison entre  journées' },
    { value: '1', label: 'comparaison entre périodes' },
    { value: '2', label: 'comparaison entre années' }
  ];
choixc:string='0';
choixlevel1:string='0';
choixCompareForm:FormGroup;
choixForm:FormGroup;
dynamicForm: FormGroup;
multiAxisData: multiAxisData;
multiAxisOptions: any;
pointventes:PointVente[]=[]
i:datasetDto;
displayCb:boolean=false;
  constructor(private formBuilder: FormBuilder,private _PointVenteEndPointService:PointVenteEndPointService,
    private _PartnerAnalyticsEndPoint:PartnerAnalyticsEndPointService,private datePipe: DatePipe) { }

  ngOnInit() {
    this.createForm();
    this.getPointvente();
this.multiAxisOptions = {
    responsive: true,
    hoverMode: 'index',
    stacked: false,
    scales: {
        yAxes: [{
            type: 'linear',
            display: true,
            position: 'left',
            id: 'y-axis-1',
        }, {
            type: 'linear',
            display: true,
            position: 'right',
            id: 'y-axis-2',
            gridLines: {
                drawOnChartArea: false
            }
        }]
    }
};

  }
   // convenience getters for easy access to form fields
   get f() { return this.dynamicForm.controls; }
   get t() { return this.f.tickets as FormArray; }
   addticket(){
     
    this.t.push(this.formBuilder.group({
      name: ['', Validators.required]
  }));
   }

   createForm(){
    this.dynamicForm = this.formBuilder.group({
      remise:['', Validators.required],
      choixlevel1:[],
      tickets: new FormArray([])
  });
   }
   createForm2(){
    this.choixCompareForm = this.formBuilder.group({
      tickets: new FormArray([])
  });
   }

   getPointvente(){
     this._PointVenteEndPointService.findAllByIdPartenaireBprice(localStorage.getItem('partenaireid')).subscribe(val=>{
       console.log(val);
       if(val.result==1)
          this.pointventes=val.objectResponse;
     })
   }
   

   deleteJournee(i:number){
    this.t.removeAt(i);
   }

   resetCourbe(){
    this.multiAxisData=new multiAxisData()
    this.displayCb=false
   }
   rempliraxes(){
    this.multiAxisData=new multiAxisData()
    this.multiAxisData.datasets=[]
     this.getCA(this.pointventes[0].idPointVente,new Date).subscribe(val=>{
       console.log(val);
       if(val.result==1){
        this.multiAxisData.labels=val.objectResponse.hours;
        let courbe=new datasetDto();
        courbe.data=val.objectResponse.ca
        courbe.label=this.pointventes[0].designation
        console.log(courbe);
        
        // this.multiAxisData.datasets.push(courbe)
       }
       
     })
     
     
    //  this.i=new datasetDto();
    // this.i.data=[50,60,20]
    // this.i.label='test1'
     
    //  this.multiAxisData.datasets.push(this.i)
     this.i=new datasetDto();
     this.i.data=[10,40,80]
     this.i.label='test2'
     this.i.borderColor='red'
     this.multiAxisData.datasets.push(this.i)
     this.displayCb=true
   }

   getCA(pointVenteId,date){
    return this._PartnerAnalyticsEndPoint.getListEvolCAInDay(pointVenteId,this.datePipe.transform(date,"yyyy-MM-dd"))
   }
}
