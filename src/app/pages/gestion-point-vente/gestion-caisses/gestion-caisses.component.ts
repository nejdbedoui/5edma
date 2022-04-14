import { Component, OnInit } from '@angular/core';
import { PointVenteEndPointService } from '../../../service/bp-api-pos/point-vente-end-point/point-vente-end-point.service';
import { PointVente } from '../../../model/PointVente';

@Component({
  selector: 'ngx-gestion-caisses',
  templateUrl: './gestion-caisses.component.html',
  styleUrls: ['./gestion-caisses.component.scss']
})
export class GestionCaissesComponent implements OnInit {

  constructor(private _PointVenteEndPointService:PointVenteEndPointService) { }

  loading:boolean=false
  pointventes:PointVente[]=[]
  sortOptions: any[];

    sortKey: string;

    sortField: string;

    sortOrder: number;
  ngOnInit() {
    this.sortOptions = [
      {label: 'tri croissant par description', value: '!year'},
      {label: 'tri décroissant par description', value: 'year'}
  ];
    this._PointVenteEndPointService.findAllByIdPartenaireBprice(localStorage.getItem("partenaireid")).subscribe(val=>{
      if(val.result==1){
        this.pointventes=val.objectResponse
      }
    })
  }
  onSortChange(event) {
    let value = event.value;
console.log(event);

    if (value.indexOf('!') === 0) {
        this.sortOrder = -1;
        this.sortField = value.substring(1, value.length);
        this.pointventes.sort((a,b)=> a.designation.localeCompare(b.designation))
    }
    else {
      this.pointventes.sort((a,b)=> - a.designation.localeCompare(b.designation))

        this.sortOrder = 1;
        this.sortField = value;
    }
}

}
