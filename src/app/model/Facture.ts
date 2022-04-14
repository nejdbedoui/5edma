export class Facture {
    id: string;
    montantTtc: number;
    montantHt: number;
    idPointvente: string;
    idPartenaire: string;
    dateGeneration: Date;
    numFacture: string;
    statut:number;
    bonCommandes : Array<string>
}