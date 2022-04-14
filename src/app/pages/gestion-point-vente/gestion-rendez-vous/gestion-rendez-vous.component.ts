import { PointVenteEndPointService } from './../../../service/bp-api-pos/point-vente-end-point/point-vente-end-point.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BpApiReservationService } from '../../../service/bp-api-reservation/bp-api-reservation.service';
import { ReservationDto } from '../../../model/dto/ReservationDto';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { GlobalServiceService } from '../../../service/GlobalService/global-service.service';
import { PointVente } from '../../../model/PointVente';
import { ProduitProintVenteEndPointService } from '../../../service/bp-api-product/produit-proint-vente-end-point/produit-proint-vente-end-point.service';
import { VProduitProduitpointvente } from '../../../model/VProduitProduitpointvente';
import { ExportRdv } from '../../../model/ExportRdv';
import { formatDate } from '@angular/common';

@Component({
  selector: 'ngx-gestion-rendez-vous',
  templateUrl: './gestion-rendez-vous.component.html',
  styleUrls: ['./gestion-rendez-vous.component.scss']
})
export class GestionRendezVousComponent implements OnInit {

  constructor(private router:Router,private _BpApiReservationService:BpApiReservationService,
    private _GlobalService:GlobalServiceService,private _PointVenteEndPointService:PointVenteEndPointService,
    private _ProduitProintVenteEndPointService:ProduitProintVenteEndPointService) { }

  loading:boolean=true
  sortOptions: any[];

    sortKey: string;

    sortField: string;

    sortOrder: number;
    rdv:ReservationDto=new ReservationDto()
    options: any;
    events:any[]=[]
    eventstemp:any[]=[]
    checked:boolean=true
    es:any
    diplay:boolean=false
    pv:PointVente=new PointVente()
    listrdv:number=0
    produitpointventes:VProduitProduitpointvente[]=[]
  ngOnInit() {
    this.cols = [
      { field: 'Date RDV', header: 'Date RDV' },
      { field: 'Client', header: 'Client' },
      { field: 'Client Tel', header: 'Client Tel' },
      { field: 'État', header: 'État' },
      { field: 'État', header: 'État' },
      { field: 'Action', header: 'Action' },
  ];
  this.es = {
    monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio',
        'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
};
  this.options = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    locale:"fr",
    header: {
        left: 'prev,next',
        center: 'title',
        right: 'month,agendaWeek,agendaDay'
    },
    editable: true
};
this._PointVenteEndPointService.findPointVenteByIdPointVente(localStorage.getItem('pointventeid')).subscribe(val=>{
  this.pv=val.objectResponse
  if(this.pv.fGestionTable==1){
    this.cols = [
      { field: 'Date RDV', header: 'Date RDV' },
      { field: 'Client', header: 'Client' },
      { field: 'Client Tel', header: 'Client Tel' },
      { field: 'État', header: 'État' },
      { field: 'État', header: 'État' },
      { field: 'Action', header: 'Action' },
  ];
  }else{
    this.cols = [
      { field: 'Date RDV', header: 'Date RDV' },
      { field: 'Client', header: 'Client' },
      { field: 'Client Tel', header: 'Client Tel' },
      { field: 'État', header: 'État' },
      { field: 'État', header: 'État' },
      { field: 'État', header: 'État' },
      { field: 'Action', header: 'Action' },
  ];
  }
  
})
this._ProduitProintVenteEndPointService.findAllProduitPointVenteByIdPointVente(localStorage.getItem('pointventeid')).subscribe(el=>{
  console.log(el);
  this.produitpointventes=el.objectResponse
  this.rdv.fTraite=0
  this.rdv.idPointVente= localStorage.getItem('pointventeid')
  this._BpApiReservationService.findReservationByStatusAndIdPointVente(this.rdv).subscribe(pv=>{
    this.loading=false
    console.log(pv);
    
    if(pv.result==1){
      
      pv.objectResponse.forEach(el=>{
        this.rdvs.push(el)
      })
      this.listrdv=this.listrdv+pv.objectResponse.length
      pv.objectResponse.forEach(val1=>{
        val1.listReservations.forEach(val=>{
          this.eventstemp.push({
            "title": "RDV",
          "start": val.dateReseravation,
          "color":" rgb(245, 140, 42)"
          })
        })
      })
      this.events=this.eventstemp
    }
  })
  let rdv2:ReservationDto=new ReservationDto()
  rdv2.fTraite=1
  rdv2.idPointVente= localStorage.getItem('pointventeid')
  this._BpApiReservationService.findReservationByStatusAndIdPointVente(rdv2).subscribe(pv=>{
    console.log(pv);
    
    if(pv.result==1){
      pv.objectResponse.forEach(el=>{
        this.rdvs.push(el)
      })
      this.listrdv=this.listrdv+pv.objectResponse.length

      pv.objectResponse.forEach(val1=>{
        val1.listReservations.forEach(val=>{
          this.eventstemp.push({
            "title": "RDV",
          "start": val.dateReseravation,
          "color":"#8DCE4C"
          })
        })
      })
      this.events=this.eventstemp
    }
  })
})

  
  }

  exportExcel() {
    let exportRdvs:ExportRdv[]=[]
    this.rdvs.forEach(el=>{
      let exportRdv:ExportRdv=new ExportRdv()
      exportRdv.client=el.nomClient +" "+el.prenomClient;
      exportRdv.telephone=el.telClient
      el.listReservations.forEach(el2=>{
        exportRdv.date=el2.dateReseravation;
        console.log(this.pv.fGestionTable);
        
        if(this.pv.fGestionTable==1){
          exportRdv.table=String(el2.tableCaisse.numTable);
        }else if (this.pv.fGestionTable!=1){
          // exportRdv.table=this.getproduitname(el2.produitsQtes)
        }
        exportRdv.etat=el2.fTraite==0?"En attente":el2.fTraite==1?"Traite":"Annuler"
      })
      
      exportRdvs.push(exportRdv)
    })
    
    import("xlsx").then(xlsx => {
        const worksheet = xlsx.utils.json_to_sheet(exportRdvs);
        const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, "produits");
    });
}
 
saveAsExcelFile(buffer: any, fileName: string): void {
  import("file-saver").then(FileSaver => {
      let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      let EXCEL_EXTENSION = '.xlsx';
      const data: Blob = new Blob([buffer], {
          type: EXCEL_TYPE
      });
      FileSaver.saveAs(data, fileName + '_export_' + formatDate(new Date(), 'dd_MM_yyyy_hh_mm', 'en-US') + EXCEL_EXTENSION);
  });
}
  rdvs:any[]=[]

cols: any[];
getproduitname(produitsQtes){
  if(produitsQtes==null){
    return '---'
  }else{
    return this.produitpointventes.filter(el=>el.produitpointvente.idproduitPointVente==produitsQtes[0].idProduit)[0].designation
  }
}
redirect(){
  this.router.navigateByUrl("/pages/Pointvente/gestionRendezVous/NouveauRendezVous")
}
currentrdv:ReservationDto=new ReservationDto()
deactive(item){  
  this.currentrdv=item.listReservations[0]
  
  this.diplay=true
}
updaterdv(){
  this.currentrdv.fTraite=-1
  console.log(this.currentrdv);
  this._BpApiReservationService.updateReservation(this.currentrdv).subscribe(val=>{
    console.log(val);
    
    if(val.result==0){
      this._GlobalService.showToast('success',"success","le RDV a été deactivé avec succès")
      //  this.rdvs.forEach(el=>{
      //    if(el.listReservations[0].idReservation=this.currentrdv.idReservation){
      //     el.listReservations[0].fTraite=-1
      //    }
      //   }
      //    )
    }else{
      this._GlobalService.showToast('danger',"Erruer",val.errorDescription)
      //this.annuler()
    }
  },erruer=>{
    this._GlobalService.showToast('danger',"Erruer",erruer)
    //this.annuler()
  })
}
clickButton(event){
  console.log(event);
  
}

customSort(event){
  console.log(event);
  if(event.field=="date"){
    event.data.sort((data1, data2) => {
      if(event.order==1){
        return new Date(data2.listReservations[0].dateReseravation).getTime() -new Date(data1.listReservations[0].dateReseravation).getTime()
     }else{
      return new Date(data1.listReservations[0].dateReseravation).getTime() -new Date(data2.listReservations[0].dateReseravation).getTime()
     } 
     }); 
  }else if(event.field=="status"){
    event.data.sort((data1, data2) => {
      if(event.order==1){
        return data2.listReservations[0].fTraite -data1.listReservations[0].fTraite
     }else{
      return data1.listReservations[0].fTraite -data2.listReservations[0].fTraite
     } 
     }); 
  }

}
traite(rdv){
  rdv.fTraite=1
  let reservation:ReservationDto=new ReservationDto()
  reservation.idReservation=rdv.listReservations[0].idReservation
  reservation.fTraite=1
  console.log(reservation);
  
  this._BpApiReservationService.treatOrCancelReservation(reservation).subscribe(val=>{
    console.log(val);
    
    if(val.result==0){
      this.rdvs.forEach(el=>{
        if(el.listReservations[0].idReservation==rdv.listReservations[0].idReservation){
          el.listReservations[0].fTraite=1
        }
      })
      this._GlobalService.showToast('success',"success","le RDV a été Traité avec succès")
    }else{
      this._GlobalService.showToast('danger',"Erruer",val.errorDescription)
      //this.annuler()
    }
  },erruer=>{
    this._GlobalService.showToast('danger',"Erruer",erruer)
    //
  })
}
modifer(rdv){
  this.router.navigateByUrl("/pages/Pointvente/gestionRendezVous/ModifierRendezVous/"+rdv.listReservations[0].idReservation)
}
}
