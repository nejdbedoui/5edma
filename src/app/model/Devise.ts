import { BilletMonnaie } from './BilletMonnaie';

export class Devise{
    code: string;
  designation: string;
  fDefaut: number;
  idDevise: string;
  idPointVente: string;
  refMonetique: BilletMonnaie[];
  taux: number
}