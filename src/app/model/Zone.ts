import { TableCaisse } from './TableCaisse';
import { Utilisateur } from './Utilisateur';
export class Zone {
    idZone : string;
    idPointVente : string;
    name : string;
    employer : Utilisateur;
    tableCaisses : TableCaisse[];
}
