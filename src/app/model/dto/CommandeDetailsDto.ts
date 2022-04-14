import { Prodcut } from '../Product';
import { Pack } from '../Pack';
export class CommandeDetailsDto{
    idDetailComm: string;
  produit: Prodcut;
  pack:Pack;
  idTicket: string;
  quantite: number;
  remise:number;
  prixSansRemise:number;
}