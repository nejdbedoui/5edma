import { PointVente } from './PointVente';
import { JoursRegle } from './JoursRegle';
import { Quantite } from './Quantite';
export class ReglesFideliteProduit{
  dateDebut: Date;
  dateFin: Date;
  fAutorisGerant: number;
  fMoinsCherGratuit: number;
  fPourcentage: number;
  idPack: string;
  idPartenaireBprice: string;
  idProduit: string;
  idRegle: string;
  isActif: number;
  joursUtilisation: JoursRegle[];
  palMontantMin: number;
  palMontatntMax: number;
  pointsVentes: PointVente[];
  produitsCombines: Quantite[];
  quantite: number;
  typeFid: string;
  valeur: number
}