import { Devise } from '../Devise';
import { Taxe } from '../Taxe';
export class Fichepointvente{
    idFichepointvente:String;
    designation:string;
      cordx:string;
      cordy:string;
      gestiontable:boolean;
      autoriserphoto:boolean;
      clavier:boolean;
      Imprimante:boolean;
      autoriserpartage:boolean;
      reimprimer:boolean;
      autoriserimpression:boolean;
      entetepiedticket:boolean;
      Controlercaisse:boolean;
      taxe:Taxe[];
      taxeselected:Taxe;
      prixproduitrecu:string;
      paiment:any[];
      defaultouverture:string;
      differenceautorise:string;
      entete:string;
      pied:string;
      devise:Devise[];
      adresse:string;
      chiffrevirgule: string;
      fdetectPack:number
      fAffectEmployetoservice:boolean;
      fAutoriserRecharge:boolean;
      fdetailMontant:boolean;
      fReservation:boolean;
      typePv:string;
      dateMiseCirc:Date;
      fEcranCuisine:number;
}