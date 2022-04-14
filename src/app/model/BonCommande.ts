import { MvtStock } from "./MvtStock";
import { MvtStockProduct } from "./MvtStockProduct";

export class BonCommande {
    id: string;
    generatedDate: Date;
    referance: string;
    mvtStockProducts: MvtStockProduct[];
    idPointVente: string;
    total: number;
    etat: number;
    idPartenaire: string;
}