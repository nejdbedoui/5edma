import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BonCommandePv } from '../../../../model/BonCommandePv';
import { CommandePv } from '../../../../model/CommandePv';
import { DetailCommandePv } from '../../../../model/DetailCommandePv';
import { ProduitDto } from '../../../../model/dto/ProduitDto';
import { Prodcut } from '../../../../model/Product';
import { BonCommandePvEndPointService } from '../../../../service/bp-api-pos/bon-commande-pv-end-poin/bon-commande-pv-end-point.service';
import { ProductEndPointService } from '../../../../service/bp-api-product/product-end-point/product-end-point.service';
import { GlobalServiceService } from '../../../../service/GlobalService/global-service.service';

@Component({
  selector: 'ngx-create-commande-pv',
  templateUrl: './create-commande-pv.component.html',
  styleUrls: ['./create-commande-pv.component.scss']
})
export class CreateCommandePvComponent implements OnInit {

  ListeProduit:Prodcut[];
  ListeDetailCommande:DetailCommandePv[]=[];

  constructor( private _produitService:ProductEndPointService,private route:ActivatedRoute,private router:Router,private _GlobalServiceService:GlobalServiceService,private _bonCommandeService: BonCommandePvEndPointService) { }
  idb:string = this.route.snapshot.paramMap.get('idb');
  idc:string = this.route.snapshot.paramMap.get('idc');
  PointVenteid=localStorage.getItem('pointventeid');
  dateLivraison:Date;
  bonCommande:BonCommandePv;

  ngOnInit() {
    this.getAllProduitByIdCategorie(this.idc);
    this._bonCommandeService.findByIdBonCommandePv(this.idb).subscribe(response=>{
      if (response.result==1){
        this.bonCommande = response.objectResponse;
        this.dateLivraison=new Date(response.objectResponse.date);
        this.dateLivraison.setHours(new Date().getHours());
        this.dateLivraison.setMinutes(new Date().getMinutes());
        this.dateLivraison.setMilliseconds(new Date().getMilliseconds());
        
      }
      else{
        this._GlobalServiceService.showToast('danger',"Erreur",response.errorDescription);
      }
    });

  }
getAllProduitByIdCategorie(id:String){
  this._produitService.findAllProductByIdCategorieArticleAndIdPointVente(id,this.PointVenteid).subscribe(val=>{
    if(val.objectResponse!=null){
      this.ListeProduit = val.objectResponse;
      
      this.ListeProduit.forEach(e => {
        if(e!=null){
        let ligne:DetailCommandePv = new DetailCommandePv();
        ligne.idCommandePV=this.idc;
        ligne.idProduit=e.idProduit;
        ligne.nomProduit=e.designation;
        ligne.quantiteDemande=0;
        this.ListeDetailCommande.push(ligne);
      }
      });
    }
  })

}

returntolist(){
  this.router.navigateByUrl("/pages/Pointvente/gestionBonCommandePv");
}
Submit(){
  let listeDetailsCommandes=this.ListeDetailCommande.filter(obj=>obj.quantiteDemande!=0);
  if(listeDetailsCommandes.length!=0){
    let commande:CommandePv = new CommandePv();
    commande.dateCreation = new Date();
    commande.dateReelLivraision= null;
    commande.idBonCommandePV=this.idb;
    this._bonCommandeService.createCommande(commande).subscribe(response=>{
      if (response.result==1){
        listeDetailsCommandes.forEach(element => {
          element.idCommandePV =  response.objectResponse.idCommandePv;
        });
        this._bonCommandeService.createListeDetailsCommandes(listeDetailsCommandes).subscribe(val=>{
          if (val.result==1){
            this._GlobalServiceService.showToast('success','succès',"la commande a éte ajouter avec succees");
            this.router.navigateByUrl("/pages/Pointvente/gestionBonCommandePv");
          }else{
            this._GlobalServiceService.showToast('danger',"Erreur1",response.errorDescription);
          }
        });
      }
      else{
        this._GlobalServiceService.showToast('danger',"Erreur2",response.errorDescription);
      }
    });
  }
  else{
    this._GlobalServiceService.showToast('danger',"Erreur","Liste Commande Vide");
  }


}

}
