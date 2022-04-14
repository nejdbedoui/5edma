import { Quantite } from './Quantite';
import { PointVente } from './PointVente';
export class Pack{
  dateCreation: Date;
  designation: string;
  fautoriseGerant: number;
  idPack: string;
  idPartenaire: string;
  pointVentes: PointVente[];
  prixPack: number;
  produits: Quantite[];
  taux: number;
  fRacourci:number;
  categoriesArticles:string[]
}