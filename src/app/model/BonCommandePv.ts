import { CommandePv } from "./CommandePv";

export class BonCommandePv{
      idBonCommande:string;
      numBonCommande:String;
      idPointVente:String;
      nomPointVente:String;
      idCategorie:String;
      nomCategorie:String;
      nomFournisseur:String;
      type:String;
      statut:number;
      date:Date;
      ListeCommandes:CommandePv[]=null;
}