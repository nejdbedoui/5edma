import { Produitpointvente } from './Produitpointvente';
export class VProduitProduitpointvente{
    idProduit: string;
      idCateg: string;
      idPartenaire: string;
      code: string;
      designation: string;
      description: string;
      composition: string;
      stockReel: number;
      dateCreation: Date;
      ajoutePar: string;
      reference: string;
      prixHt: number;
      prixTtc: number;
      urlImg: string;
      fVendu: number;
      fAchete: number;
      typeProduit: string;
      codeBarre: string;
      referenceInterne: string;
      fRacourci: number;
      produitpointvente:Produitpointvente;
      stockQteDepart:number;
      stockactual:number;
      stockAlert:number;
      tva:number;
}