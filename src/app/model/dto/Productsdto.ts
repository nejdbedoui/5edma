import { Prodcut } from '../Product';
import { FournisseurDto } from './FournisseurDto';
import { PointVentespriceDto } from './PointVentespriceDto';
import { Fournisseur } from './Fournisseur';

export class Productsdto {
    produit:Prodcut;
    catgorieids:string[];
    fournisseurs:Fournisseur[];
    pointVentes:PointVentespriceDto[];
}